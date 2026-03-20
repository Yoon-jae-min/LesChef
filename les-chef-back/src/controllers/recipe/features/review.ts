import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Recipe from '../../../models/recipe/core/recipe';
import RecipeReview from '../../../models/recipe/social/review';
import { ApiSuccessResponse, ApiErrorResponse } from '../../../types';

/**
 * 레시피의 평균 평점과 리뷰 수를 업데이트하는 헬퍼 함수
 * @param recipeId 레시피 ID
 * @returns 평균 평점과 리뷰 수
 */
const updateRecipeRating = async (
    recipeId: string | Types.ObjectId
): Promise<{ averageRating: number; count: number }> => {
    const allReviews = await RecipeReview.find({ recipeId }).lean();
    const count = allReviews.length;
    const averageRating =
        count > 0
            ? Math.round((allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / count) * 10) /
              10 // 소수점 1자리까지
            : 0;

    await Recipe.updateOne(
        { _id: recipeId },
        {
            $set: {
                averageRating,
                reviewCount: count,
            },
        }
    );

    return { averageRating, count };
};

interface ReviewListResponse extends ApiSuccessResponse {
    reviews: unknown[];
    averageRating: number;
    count: number;
}

// 레시피 리뷰 목록 조회
export const listReviews = asyncHandler(
    async (req: Request, res: Response<ReviewListResponse | ApiErrorResponse>) => {
        const { recipeId } = req.query;

        if (!recipeId || typeof recipeId !== 'string') {
            res.status(400).json({
                error: true,
                message: 'recipeId가 필요합니다.',
            });
            return;
        }

        // 레시피 정보에서 평균 평점과 리뷰 수 가져오기 (성능 최적화)
        const recipe = await Recipe.findById(recipeId).select('averageRating reviewCount').lean();

        const reviews = await RecipeReview.find({ recipeId }).sort({ createdAt: -1 }).lean();

        // 레시피 모델의 값 사용 (없으면 계산)
        const averageRating = recipe?.averageRating || 0;
        const count = recipe?.reviewCount || reviews.length;

        res.status(200).json({
            error: false,
            reviews,
            averageRating,
            count,
        });
    }
);

interface UpsertReviewRequestBody {
    recipeId?: string;
    rating?: number;
    comment?: string;
}

interface UpsertReviewResponse extends ApiSuccessResponse {
    review: unknown;
    averageRating: number;
    count: number;
}

// 레시피 리뷰 생성/수정 (사용자당 1개)
export const upsertReview = asyncHandler(
    async (
        req: Request<{}, UpsertReviewResponse | ApiErrorResponse, UpsertReviewRequestBody>,
        res: Response<UpsertReviewResponse | ApiErrorResponse>
    ) => {
        if (!req.session?.user) {
            res.status(401).json({
                error: true,
                message: '로그인이 필요합니다.',
            });
            return;
        }

        const { recipeId, rating, comment } = req.body;

        if (!recipeId || !rating) {
            res.status(400).json({
                error: true,
                message: 'recipeId와 rating은 필수입니다.',
            });
            return;
        }

        if (rating < 1 || rating > 5) {
            res.status(400).json({
                error: true,
                message: 'rating은 1~5 사이여야 합니다.',
            });
            return;
        }

        // 레시피 존재 여부 확인
        const recipe = await Recipe.findById(recipeId).lean();
        if (!recipe) {
            res.status(404).json({
                error: true,
                message: '레시피를 찾을 수 없습니다.',
            });
            return;
        }

        const userId = req.session.user.id;
        const userNickName = req.session.user.nickName || '익명';

        const now = new Date().setMilliseconds(0);

        const review = await RecipeReview.findOneAndUpdate(
            { recipeId, userId },
            {
                $set: {
                    rating,
                    comment: comment || '',
                    userNickName,
                    updatedAt: now,
                },
                $setOnInsert: {
                    createdAt: now,
                },
            },
            {
                new: true,
                upsert: true,
            }
        ).lean();

        // 레시피의 평균 평점과 리뷰 수 업데이트 (성능 최적화)
        const { averageRating, count } = await updateRecipeRating(recipeId);

        res.status(200).json({
            error: false,
            review,
            averageRating,
            count,
        });
    }
);

interface DeleteReviewRequestBody {
    recipeId?: string;
}

interface DeleteReviewResponse extends ApiSuccessResponse {
    averageRating: number;
    count: number;
}

// 자신의 리뷰 삭제
export const deleteReview = asyncHandler(
    async (
        req: Request<{}, DeleteReviewResponse | ApiErrorResponse, DeleteReviewRequestBody>,
        res: Response<DeleteReviewResponse | ApiErrorResponse>
    ) => {
        if (!req.session?.user) {
            res.status(401).json({
                error: true,
                message: '로그인이 필요합니다.',
            });
            return;
        }

        const { recipeId } = req.body;

        if (!recipeId) {
            res.status(400).json({
                error: true,
                message: 'recipeId가 필요합니다.',
            });
            return;
        }

        const userId = req.session.user.id;

        const deleted = await RecipeReview.findOneAndDelete({ recipeId, userId }).lean();

        if (!deleted) {
            res.status(404).json({
                error: true,
                message: '삭제할 리뷰를 찾을 수 없습니다.',
            });
            return;
        }

        // 레시피의 평균 평점과 리뷰 수 업데이트 (성능 최적화)
        const { averageRating, count } = await updateRecipeRating(recipeId);

        res.status(200).json({
            error: false,
            message: 'ok',
            averageRating,
            count,
        });
    }
);
