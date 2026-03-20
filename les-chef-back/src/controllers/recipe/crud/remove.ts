/**
 * 레시피 삭제 컨트롤러
 */

import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import Recipe from '../../../models/recipe/core/recipe';
import RecipeStep from '../../../models/recipe/core/step';
import RecipeIngredient from '../../../models/recipe/core/ingredients';
import { ApiSuccessResponse, ApiErrorResponse } from '../../../types';
import logger from '../../../utils/system/logger';
import { deleteObjectByPublicUrlIfManaged } from '../../../utils/storage/objectStorage';

function isAbsoluteHttpUrl(s: string): boolean {
    return s.startsWith('http://') || s.startsWith('https://');
}

interface DeleteStep {
    path: string;
    content: Buffer;
}

interface DeleteMain {
    path: string;
    content: Buffer;
}

export const removeRecipe = asyncHandler(
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
        const recipeInfo = await Recipe.findOne({ _id: id }).lean();
        if (!recipeInfo) {
            res.status(404).json({
                error: true,
                message: '레시피를 찾을 수 없습니다.',
            });
            return;
        }
        // 본인이 작성한 레시피만 삭제 가능
        if (recipeInfo.userId !== req.session.user.id) {
            res.status(403).json({
                error: true,
                message: '본인이 작성한 레시피만 삭제할 수 있습니다.',
            });
            return;
        }
        const recipeSteps = await RecipeStep.find({ recipeId: id }).lean();
        const recipeIngres = await RecipeIngredient.find({ recipeId: id }).lean();

        let deleteMain: DeleteMain | null = null;
        let deleteStep: DeleteStep[] = [];

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            if (recipeIngres) {
                await RecipeIngredient.deleteMany({ recipeId: id });
            }

            if (recipeSteps) {
                for (const step of recipeSteps) {
                    const img = step.stepImg;
                    if (!img || img === process.env.NO_IMAGE_URL) {
                        continue;
                    }
                    // 객체 스토리지(S3/R2 등) 퍼블릭 URL
                    if (isAbsoluteHttpUrl(img)) {
                        try {
                            await deleteObjectByPublicUrlIfManaged(img);
                        } catch (s3Err) {
                            logger.warn('단계 이미지 객체 스토리지 삭제 실패(계속 진행)', {
                                error: s3Err,
                                img,
                            });
                        }
                        continue;
                    }
                    const stepImg = path.join(
                        __dirname,
                        '..',
                        '..',
                        '..',
                        '..',
                        'public',
                        img.replace(/^\//, '')
                    );

                    try {
                        const content = await fs.readFile(stepImg);
                        await fs.unlink(stepImg);
                        deleteStep.push({ path: stepImg, content });
                    } catch (readErr) {
                        const err = readErr as Error;
                        throw new Error(`Step 파일 읽기 오류: ${err.message}`);
                    }
                }
                await RecipeStep.deleteMany({ recipeId: id });
            }

            if (recipeInfo) {
                const main = recipeInfo.recipeImg;
                if (main && main !== process.env.NO_IMAGE_URL) {
                    if (isAbsoluteHttpUrl(main)) {
                        try {
                            await deleteObjectByPublicUrlIfManaged(main);
                        } catch (s3Err) {
                            logger.warn('대표 이미지 객체 스토리지 삭제 실패(계속 진행)', {
                                error: s3Err,
                                main,
                            });
                        }
                    } else {
                        const mainImg = path.join(
                            __dirname,
                            '..',
                            '..',
                            '..',
                            '..',
                            'public',
                            main.replace(/^\//, '')
                        );

                        try {
                            const content = await fs.readFile(mainImg);
                            await fs.unlink(mainImg);
                            deleteMain = {
                                path: mainImg,
                                content,
                            };
                        } catch (fileErr) {
                            const err = fileErr as Error;
                            throw new Error(`Main 파일 처리 오류: ${err.message}`);
                        }
                    }
                }
                await Recipe.deleteOne({ _id: id });
            }

            await session.commitTransaction();
            res.status(200).json({
                error: false,
                message: 'success',
                text: 'success',
            });
        } catch (err) {
            const error = err as Error;
            if (!error.message.includes('Step 파일 읽기') && deleteStep.length !== 0) {
                for (const step of deleteStep) {
                    try {
                        await fs.writeFile(step.path, step.content);
                        logger.debug('step 다시 쓰기 성공');
                    } catch (writeErr) {
                        logger.error('step 다시 쓰기 실패', { error: writeErr });
                        throw writeErr;
                    }
                }
            }

            if (error.message.includes('Main 파일 삭제') || deleteMain) {
                try {
                    await fs.writeFile(deleteMain!.path, deleteMain!.content);
                    logger.debug('main 다시 쓰기 성공');
                } catch (writeErr) {
                    logger.error('main 다시 쓰기 실패', { error: writeErr });
                    throw writeErr;
                }
            }

            await session.abortTransaction();
            logger.error('레시피 삭제 중 오류 발생', { error: err });
            res.status(500).json({
                error: true,
                message: '레시피 삭제 중 오류가 발생했습니다.',
                text: 'fail',
            });
        } finally {
            session.endSession();
        }
    }
);
