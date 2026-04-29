/**
 * 게시글 좋아요 관련 컨트롤러
 */

import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Board from '../../models/board/board';
import BoardLike from '../../models/board/like';
import { handleError } from '../../utils/error/errorUtils';
import { ApiSuccessResponse, ApiErrorResponse } from '../../types';

interface ToggleBoardLikeRequestBody {
    boardId?: string;
}

interface ToggleBoardLikeResponse extends ApiSuccessResponse {
    liked: boolean;
    likeCount: number;
}

/**
 * 게시글 좋아요 토글
 */
export const toggleBoardLike = asyncHandler(
    async (
        req: Request<{}, ToggleBoardLikeResponse | ApiErrorResponse, ToggleBoardLikeRequestBody>,
        res: Response<ToggleBoardLikeResponse | ApiErrorResponse>
    ) => {
        const userId = req.auth?.sub;
        if (!userId) {
            res.status(401).json({
                error: true,
                message: '로그인이 필요합니다.',
            });
            return;
        }

        const { boardId } = req.body;
        if (!boardId) {
            res.status(400).json({
                error: true,
                message: 'boardId가 없습니다.',
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
            const exist = await BoardLike.findOne({ boardId, userId }).lean();
            if (exist) {
                await BoardLike.deleteOne({ _id: exist._id });
            } else {
                await BoardLike.create({ boardId, userId });
            }

            const likeCount = await BoardLike.countDocuments({ boardId });
            res.status(200).json({
                error: false,
                liked: !exist,
                likeCount,
            });
        } catch (error) {
            throw handleError(error as Error, { resourceName: '게시글' });
        }
    }
);
