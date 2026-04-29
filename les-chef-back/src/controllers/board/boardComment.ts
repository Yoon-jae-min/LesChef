/**
 * 게시글 댓글 관련 컨트롤러
 */

import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Board from '../../models/board/board';
import Comment from '../../models/board/comment';
import { handleError } from '../../utils/error/errorUtils';
import { ApiSuccessResponse, ApiErrorResponse } from '../../types';

interface WriteCommentRequestBody {
    boardId?: string;
    content?: string;
}

/**
 * 댓글 작성
 */
export const writeComment = asyncHandler(
    async (
        req: Request<{}, ApiSuccessResponse | ApiErrorResponse, WriteCommentRequestBody>,
        res: Response<ApiSuccessResponse | ApiErrorResponse>
    ) => {
        const userId = req.auth?.sub;
        const userNickName = req.auth?.nickName;
        if (!userId) {
            res.status(401).json({
                error: true,
                message: '로그인이 필요합니다.',
            });
            return;
        }

        const { boardId, content } = req.body;

        if (!boardId || !content) {
            res.status(400).json({
                error: true,
                message: '게시글 ID와 댓글 내용은 필수입니다.',
            });
            return;
        }

        // 게시글 존재 확인
        const board = await Board.findOne({ _id: boardId });
        if (!board) {
            res.status(404).json({
                error: true,
                message: '게시글을 찾을 수 없습니다.',
            });
            return;
        }

        try {
            const comment = await Comment.create({
                boardId: boardId,
                nickName: userNickName || 'user',
                userId: userId,
                content: content,
            });

            res.status(200).json({
                error: false,
                ...comment.toObject(),
            });
        } catch (error) {
            throw handleError(error as Error, { resourceName: '게시글' });
        }
    }
);
