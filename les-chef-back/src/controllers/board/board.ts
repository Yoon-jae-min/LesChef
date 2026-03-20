/**
 * 게시글 CRUD 관련 컨트롤러
 * 게시글의 생성, 조회, 수정, 삭제 작업을 처리
 */

import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Board from '../../models/board/board';
import Comment from '../../models/board/comment';
import BoardLike from '../../models/board/like';
import User from '../../models/user/userModel';
import { handleError } from '../../utils/error/errorUtils';
import {
    PaginatedResponse,
    ApiSuccessResponse,
    ApiErrorResponse,
    IBoard,
    IBoardComment,
} from '../../types';

interface BoardListQuery {
    page?: string;
    limit?: string;
}

// 단일 리스트 API (현재 카테고리 분류 필드는 없으므로 전체 목록)
export const listBoards = asyncHandler(
    async (
        req: Request<{}, PaginatedResponse<IBoard> | ApiErrorResponse, {}, BoardListQuery>,
        res: Response<PaginatedResponse<IBoard> | ApiErrorResponse>
    ) => {
        try {
            const { page = '1', limit = '20' } = req.query;
            const pageNum = Math.max(parseInt(page) || 1, 1);
            const limitNum = Math.max(parseInt(limit) || 20, 1);
            const skip = (pageNum - 1) * limitNum;

            const [total, list] = await Promise.all([
                Board.countDocuments({}),
                Board.find({}, { content: 0 })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limitNum)
                    .lean(),
            ]);

            res.status(200).json({
                error: false,
                list: (list || []) as IBoard[],
                page: pageNum,
                limit: limitNum,
                total: total || 0,
            });
        } catch (error) {
            throw handleError(error as Error, { resourceName: '게시글' });
        }
    }
);

interface PostWritingRequestBody {
    title?: string;
    content?: string;
}

export const postWriting = asyncHandler(
    async (
        req: Request<{}, ApiSuccessResponse | ApiErrorResponse, PostWritingRequestBody>,
        res: Response<ApiSuccessResponse | ApiErrorResponse>
    ) => {
        if (!req.session?.user) {
            res.status(401).json({
                error: true,
                message: '로그인이 필요합니다.',
            });
            return;
        }

        const { title, content } = req.body;
        const userId = req.session.user.id;
        const userNickName = req.session.user.nickName;

        if (!title || !content) {
            res.status(400).json({
                error: true,
                message: '제목과 내용은 필수입니다.',
            });
            return;
        }

        try {
            await Board.create({
                title: title,
                userId: userId,
                nickName: userNickName,
                content: content,
            });

            res.status(200).json({
                error: false,
                message: 'ok',
            });
        } catch (error) {
            throw handleError(error as Error, { resourceName: '게시글' });
        }
    }
);

interface GetBoardQuery {
    id?: string;
}

interface GetBoardResponse extends ApiSuccessResponse {
    content: IBoard;
    comments: IBoardComment[];
    likeCount: number;
    liked: boolean;
}

// 게시글 상세 + 댓글
export const getBoard = asyncHandler(
    async (
        req: Request<{}, GetBoardResponse | ApiErrorResponse, {}, GetBoardQuery>,
        res: Response<GetBoardResponse | ApiErrorResponse>
    ) => {
        const { id } = req.query;
        if (!id) {
            res.status(400).json({
                error: true,
                message: 'id가 없습니다.',
            });
            return;
        }

        await Board.updateOne({ _id: id }, { $inc: { viewCount: 1 } });

        const content = await Board.findOne({ _id: id }).lean();
        if (!content) {
            res.status(404).json({
                error: true,
                message: '게시글을 찾을 수 없습니다.',
            });
            return;
        }
        const comments = await Comment.find({ boardId: id }).sort({ createdAt: -1 }).lean();

        // 좋아요 정보
        const likeCount = await BoardLike.countDocuments({ boardId: id });
        let liked = false;
        if (req.session?.user) {
            const exist = await BoardLike.findOne({
                boardId: id,
                userId: req.session.user.id,
            }).lean();
            liked = !!exist;
        }

        res.status(200).json({
            error: false,
            content: content as IBoard,
            comments: (comments || []) as IBoardComment[],
            likeCount: likeCount || 0,
            liked,
        });
    }
);

/**
 * 게시글 삭제
 */
export const deleteBoard = asyncHandler(
    async (req: Request<{ id?: string }>, res: Response<ApiSuccessResponse | ApiErrorResponse>) => {
        if (!req.session?.user) {
            res.status(401).json({
                error: true,
                message: '로그인이 필요합니다.',
            });
            return;
        }

        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                error: true,
                message: 'id가 없습니다.',
            });
            return;
        }

        // 게시글 존재 및 권한 확인
        const board = await Board.findOne({ _id: id });
        if (!board) {
            res.status(404).json({
                error: true,
                message: '게시글을 찾을 수 없습니다.',
            });
            return;
        }

        // 본인 게시글만 삭제 가능 (관리자는 예외)
        const user = await User.findOne({ id: req.session.user.id });
        if (board.userId !== req.session.user.id && (!user || !user.checkAdmin)) {
            res.status(403).json({
                error: true,
                message: '본인이 작성한 게시글만 삭제할 수 있습니다.',
            });
            return;
        }

        try {
            await Promise.all([
                Comment.deleteMany({ boardId: id }),
                BoardLike.deleteMany({ boardId: id }),
                Board.deleteOne({ _id: id }),
            ]);

            res.status(200).json({
                error: false,
                message: 'ok',
            });
        } catch (error) {
            throw handleError(error as Error, { resourceName: '게시글' });
        }
    }
);

interface EditBoardRequestBody {
    title?: string;
    content?: string;
}

// 게시글 수정 (프론트 edit 페이지 대응)
export const editBoard = asyncHandler(
    async (
        req: Request<{ id?: string }, ApiSuccessResponse | ApiErrorResponse, EditBoardRequestBody>,
        res: Response<ApiSuccessResponse | ApiErrorResponse>
    ) => {
        if (!req.session?.user) {
            res.status(401).json({
                error: true,
                message: '로그인이 필요합니다.',
            });
            return;
        }

        const { id } = req.params;
        const { title, content } = req.body;

        if (!id) {
            res.status(400).json({
                error: true,
                message: 'id가 없습니다.',
            });
            return;
        }

        if (!title || !content) {
            res.status(400).json({
                error: true,
                message: '제목과 내용은 필수입니다.',
            });
            return;
        }

        // 게시글 존재 및 권한 확인
        const board = await Board.findOne({ _id: id });
        if (!board) {
            res.status(404).json({
                error: true,
                message: '게시글을 찾을 수 없습니다.',
            });
            return;
        }

        // 본인 게시글만 수정 가능 (관리자는 예외)
        const user = await User.findOne({ id: req.session.user.id });
        if (board.userId !== req.session.user.id && (!user || !user.checkAdmin)) {
            res.status(403).json({
                error: true,
                message: '본인이 작성한 게시글만 수정할 수 있습니다.',
            });
            return;
        }

        try {
            const result = await Board.updateOne(
                { _id: id },
                { $set: { title, content, updatedAt: new Date().setMilliseconds(0) } }
            );

            // 동일 내용으로 저장하면 modifiedCount 가 0일 수 있음 → matchedCount 로 존재 여부만 판단
            if (result.matchedCount === 0) {
                res.status(404).json({
                    error: true,
                    message: '게시글을 찾을 수 없습니다.',
                });
                return;
            }

            res.status(200).json({
                error: false,
                message: 'ok',
            });
        } catch (error) {
            throw handleError(error as Error, { resourceName: '게시글' });
        }
    }
);
