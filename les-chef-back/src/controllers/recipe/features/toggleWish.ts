/**
 * 레시피 찜하기 컨트롤러
 */

import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import User from '../../../models/user/userModel';
import RecipeWishList from '../../../models/recipe/social/wishList';
import { ApiSuccessResponse, ApiErrorResponse } from '../../../types';

interface ToggleWishRequestBody {
    recipeId?: string;
}

interface ToggleWishResponse extends ApiSuccessResponse {
    recipeWish: boolean;
}

export const toggleWish = asyncHandler(
    async (
        req: Request<{}, ToggleWishResponse | ApiErrorResponse, ToggleWishRequestBody>,
        res: Response<ToggleWishResponse | ApiErrorResponse>
    ) => {
        // 세션 검증
        if (!req.session?.user?.id) {
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
                message: '레시피 ID가 필요합니다.',
            });
            return;
        }

        const user = await User.findOne({ id: req.session.user.id });

        if (!user) {
            res.status(404).json({
                error: true,
                message: '사용자를 찾을 수 없습니다.',
            });
            return;
        }

        const wishList = await RecipeWishList.findOne({ userId: user._id });
        let recipeWish = true;

        if (wishList) {
            const exist = wishList.wishList.some(
                (wish) => wish.recipeId.toString() === recipeId.toString()
            );

            await RecipeWishList.updateOne(
                { userId: user._id },
                exist
                    ? { $pull: { wishList: { recipeId: recipeId } } }
                    : { $addToSet: { wishList: { recipeId: recipeId } } }
            );
            recipeWish = exist ? false : true;
        } else {
            await RecipeWishList.create({
                userId: user._id,
                wishList: [
                    {
                        recipeId: recipeId,
                    },
                ],
            });
        }

        res.status(200).json({
            error: false,
            recipeWish: recipeWish,
        });
    }
);
