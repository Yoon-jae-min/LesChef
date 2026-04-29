/**
 * 레시피 삭제 컨트롤러
 *
 * DB 삭제를 먼저 수행한 뒤 이미지는 best-effort 로 정리합니다.
 * (과거) mongoose 세션/트랜잭션은 작업에 session 이 전달되지 않았고,
 * standalone MongoDB 에서는 트랜잭션 자체가 실패할 수 있어 제거했습니다.
 */

import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import Recipe from '../../../models/recipe/core/recipe';
import RecipeStep from '../../../models/recipe/core/step';
import RecipeIngredient from '../../../models/recipe/core/ingredients';
import RecipeReview from '../../../models/recipe/social/review';
import RecipeWishList from '../../../models/recipe/social/wishList';
import { ApiSuccessResponse, ApiErrorResponse } from '../../../types';
import logger from '../../../utils/system/logger';
import { deleteObjectByPublicUrlIfManaged } from '../../../utils/storage/objectStorage';

function isAbsoluteHttpUrl(s: string): boolean {
    return s.startsWith('http://') || s.startsWith('https://');
}

export const removeRecipe = asyncHandler(
    async (req: Request<{ id?: string }>, res: Response<ApiSuccessResponse | ApiErrorResponse>) => {
        const userId = req.auth?.sub;
        if (!userId) {
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
        const recipeInfo = await Recipe.findOne({ _id: id }).lean();
        if (!recipeInfo) {
            res.status(404).json({
                error: true,
                message: '레시피를 찾을 수 없습니다.',
            });
            return;
        }
        if (String(recipeInfo.userId) !== String(userId)) {
            res.status(403).json({
                error: true,
                message: '본인이 작성한 레시피만 삭제할 수 있습니다.',
            });
            return;
        }

        const recipeSteps = await RecipeStep.find({ recipeId: id }).lean();
        const publicRoot = path.join(__dirname, '..', '..', '..', '..', 'public');

        try {
            await RecipeIngredient.deleteMany({ recipeId: id });
            await RecipeStep.deleteMany({ recipeId: id });
            await RecipeReview.deleteMany({ recipeId: id });
            await RecipeWishList.updateMany(
                { 'wishList.recipeId': id },
                { $pull: { wishList: { recipeId: id } } }
            );
            await Recipe.deleteOne({ _id: id });
        } catch (dbErr) {
            logger.error('레시피 DB 삭제 실패', { error: dbErr, recipeId: id });
            res.status(500).json({
                error: true,
                message: '레시피 삭제 중 오류가 발생했습니다.',
                text: 'fail',
            });
            return;
        }

        for (const step of recipeSteps) {
            const img = step.stepImg;
            if (!img || img === process.env.NO_IMAGE_URL) {
                continue;
            }
            if (isAbsoluteHttpUrl(img)) {
                try {
                    await deleteObjectByPublicUrlIfManaged(img);
                } catch (s3Err) {
                    logger.warn('단계 이미지 객체 스토리지 삭제 실패(무시)', {
                        error: s3Err,
                        img,
                    });
                }
                continue;
            }
            const stepImgPath = path.join(publicRoot, img.replace(/^\//, ''));
            try {
                await fs.unlink(stepImgPath);
            } catch (unlinkErr) {
                logger.warn('단계 로컬 이미지 삭제 실패(무시)', {
                    error: unlinkErr,
                    stepImgPath,
                });
            }
        }

        const main = recipeInfo.recipeImg;
        if (main && main !== process.env.NO_IMAGE_URL) {
            if (isAbsoluteHttpUrl(main)) {
                try {
                    await deleteObjectByPublicUrlIfManaged(main);
                } catch (s3Err) {
                    logger.warn('대표 이미지 객체 스토리지 삭제 실패(무시)', {
                        error: s3Err,
                        main,
                    });
                }
            } else {
                const mainImgPath = path.join(publicRoot, main.replace(/^\//, ''));
                try {
                    await fs.unlink(mainImgPath);
                } catch (unlinkErr) {
                    logger.warn('대표 로컬 이미지 삭제 실패(무시)', {
                        error: unlinkErr,
                        mainImgPath,
                    });
                }
            }
        }

        res.status(200).json({
            error: false,
            message: 'success',
            text: 'success',
        });
    }
);
