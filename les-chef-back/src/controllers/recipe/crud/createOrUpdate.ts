/**
 * 레시피 작성/수정 컨트롤러
 */

import asyncHandler from 'express-async-handler';
import { Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { Types } from 'mongoose';
import User from '../../../models/user/userModel';
import Recipe from '../../../models/recipe/core/recipe';
import RecipeIngredient from '../../../models/recipe/core/ingredients';
import RecipeStep from '../../../models/recipe/core/step';
import { safeJsonParse } from '../../../middleware/security/security';
import { handleError } from '../../../utils/error/errorUtils';
import { ApiSuccessResponse, ApiErrorResponse, MulterRequest } from '../../../types';
import {
    generateRecipeListThumbnail,
    generateRecipeStepThumbnail,
} from '../../../utils/image/imageProcessor';
import logger from '../../../utils/system/logger';
import { isS3Storage } from '../../../config/storage';
import {
    uploadBufferToObjectStorage,
    deleteObjectByPublicUrlIfManaged,
} from '../../../utils/storage/objectStorage';
import { recipeListCategoryKey, type RecipeListCategory } from '../../../uploads/recipeImg';

interface CreateOrUpdateRequestBody {
    recipeInfo?: string;
    recipeIngredients?: string;
    recipeSteps?: string;
    isEdit?: string;
    deleteImgs?: string | string[];
}

interface ParsedRecipeInfo {
    _id?: string;
    recipeName?: string;
    cookTime?: number;
    portion?: number;
    portionUnit?: string;
    cookLevel?: string;
    majorCategory?: string;
    subCategory?: string;
    recipeImg?: string;
    viewCount?: number;
}

interface ParsedIngredient {
    sortType?: string;
    ingredientUnit?: Array<{
        ingredientName?: string;
        volume?: number;
        unit?: string;
    }>;
}

interface ParsedStep {
    stepNum?: number;
    stepWay?: string;
    stepImg?: string;
}

/** multer 임시 파일 → public/Image/RecipeImage/InfoImg/step/{카테고리}/{recipeId}/ 또는 S3 동일 키 */
async function finalizeRecipeStepImageFromTemp(params: {
    tempPath: string;
    categoryKey: RecipeListCategory;
    recipeId: string;
    mimetype?: string;
}): Promise<string> {
    const { tempPath, categoryKey, recipeId, mimetype } = params;
    const basename = path.basename(tempPath);
    const segments = ['Image', 'RecipeImage', 'InfoImg', 'step', categoryKey, recipeId];

    if (isS3Storage()) {
        const body = await fs.readFile(tempPath);
        const objectKey = [...segments, basename].join('/');
        const url = await uploadBufferToObjectStorage({
            objectKey,
            body,
            contentType: mimetype || 'image/jpeg',
        });
        await fs.unlink(tempPath).catch(() => {});
        return url;
    }

    const publicRoot = path.join(__dirname, '..', '..', '..', '..', 'public');
    const destDir = path.join(publicRoot, ...segments);
    await fs.mkdir(destDir, { recursive: true });
    const destPath = path.join(destDir, basename);
    await fs.copyFile(tempPath, destPath);
    await fs.unlink(tempPath).catch(() => {});
    try {
        await generateRecipeStepThumbnail(destPath, destDir);
    } catch (thumbError) {
        logger.warn('단계 썸네일 생성 실패', { error: thumbError });
    }
    return `/${segments.join('/')}/${basename}`;
}

export const createOrUpdate = asyncHandler(
    async (req: MulterRequest, res: Response<ApiSuccessResponse | ApiErrorResponse>) => {
        // 세션 검증
        if (!req.session?.user?.id) {
            res.status(401).json({
                error: true,
                message: '로그인이 필요합니다.',
            });
            return;
        }

        try {
            const { recipeInfo, recipeIngredients, recipeSteps, isEdit, deleteImgs } =
                req.body as CreateOrUpdateRequestBody;

            // 필수 데이터 검증
            if (!recipeInfo || !recipeIngredients || !recipeSteps) {
                res.status(400).json({
                    error: true,
                    message: '필수 데이터가 누락되었습니다.',
                });
                return;
            }

            // 안전한 JSON 파싱
            const parsedRecipeInfo = safeJsonParse(recipeInfo) as ParsedRecipeInfo;
            const parsedRecipeIngredients = safeJsonParse(recipeIngredients) as ParsedIngredient[];
            const parsedRecipeSteps = safeJsonParse(recipeSteps) as ParsedStep[];
            const parsedIsEdit = safeJsonParse(isEdit || 'false') as boolean;

            // 최소 요구사항 검증
            // 1. 레시피 이름 필수
            if (!parsedRecipeInfo.recipeName || parsedRecipeInfo.recipeName.trim().length === 0) {
                res.status(400).json({
                    error: true,
                    message: '레시피 이름을 입력해주세요.',
                    field: 'recipeName',
                });
                return;
            }

            // 2. 재료 1개 이상 필수
            const hasValidIngredient = parsedRecipeIngredients.some(
                (ingredient) =>
                    ingredient.ingredientUnit &&
                    ingredient.ingredientUnit.some(
                        (unit) => unit.ingredientName && unit.ingredientName.trim().length > 0
                    )
            );
            if (!hasValidIngredient) {
                res.status(400).json({
                    error: true,
                    message: '최소 1개 이상의 재료를 입력해주세요.',
                    field: 'ingredients',
                });
                return;
            }

            // 3. 조리 단계 1개 이상 필수
            const hasValidStep = parsedRecipeSteps.some(
                (step) => step.stepWay && step.stepWay.trim().length > 0
            );
            if (!hasValidStep) {
                res.status(400).json({
                    error: true,
                    message: '최소 1개 이상의 조리 단계를 입력해주세요.',
                    field: 'steps',
                });
                return;
            }

            // 불필요한 undefined 요소 제거
            const deleteImgsArray = (Array.isArray(deleteImgs) ? deleteImgs : [deleteImgs]).filter(
                Boolean
            ) as string[];

            const userInfo = await User.findOne({ id: req.session.user.id }).lean();

            if (!userInfo) {
                res.status(404).json({
                    error: true,
                    message: '사용자를 찾을 수 없습니다.',
                });
                return;
            }
            let isShare = true;

            if (userInfo.checkAdmin) {
                isShare = false;
            }

            // 레시피 대표 이미지 처리 (로컬: 썸네일 생성 / S3: 객체 스토리지 업로드)
            if (parsedRecipeInfo.recipeImg === '') {
                const files = req.files as
                    | {
                          recipeImgFile?: Array<{
                              newPath?: string;
                              path?: string;
                              mimetype?: string;
                          }>;
                      }
                    | undefined;
                const uploadedFile = files?.recipeImgFile?.[0];
                if (!uploadedFile?.newPath || !uploadedFile.path) {
                    res.status(400).json({
                        error: true,
                        message: '레시피 대표 이미지가 필요합니다.',
                    });
                    return;
                }

                if (isS3Storage()) {
                    const key = uploadedFile.newPath.replace(/^\/+/, '');
                    const body = await fs.readFile(uploadedFile.path);
                    parsedRecipeInfo.recipeImg = await uploadBufferToObjectStorage({
                        objectKey: key,
                        body,
                        contentType: uploadedFile.mimetype || 'image/jpeg',
                    });
                    await fs.unlink(uploadedFile.path).catch(() => {});
                } else {
                    parsedRecipeInfo.recipeImg = uploadedFile.newPath.startsWith('/')
                        ? uploadedFile.newPath
                        : `/${uploadedFile.newPath}`;

                    try {
                        const outputDir = path.dirname(uploadedFile.path);
                        await generateRecipeListThumbnail(uploadedFile.path, outputDir);
                    } catch (thumbError) {
                        logger.warn('썸네일 생성 실패', { error: thumbError });
                    }
                }
            }

            const categoryKey = recipeListCategoryKey(parsedRecipeInfo.majorCategory);

            const uploadedStepFiles =
                (
                    req.files as
                        | {
                              recipeStepImgFiles?: Array<{
                                  path?: string;
                                  mimetype?: string;
                              }>;
                          }
                        | undefined
                )?.recipeStepImgFiles || [];

            let recipeId: Types.ObjectId | string;

            if (parsedIsEdit) {
                if (!parsedRecipeInfo._id) {
                    res.status(400).json({
                        error: true,
                        message: '수정할 레시피 ID가 필요합니다.',
                    });
                    return;
                }

                const existingRecipe = await Recipe.findOne({
                    userId: userInfo.id,
                    _id: parsedRecipeInfo._id,
                });
                if (!existingRecipe) {
                    res.status(404).json({
                        error: true,
                        message: '수정할 레시피를 찾을 수 없습니다.',
                    });
                    return;
                }
                recipeId = parsedRecipeInfo._id;
            } else {
                const infoAdd = await Recipe.create({
                    recipeName: parsedRecipeInfo.recipeName,
                    cookTime: parsedRecipeInfo.cookTime,
                    portion: parsedRecipeInfo.portion,
                    portionUnit: parsedRecipeInfo.portionUnit,
                    cookLevel: parsedRecipeInfo.cookLevel,
                    userId: userInfo.id,
                    userNickName: userInfo.nickName,
                    majorCategory: parsedRecipeInfo.majorCategory,
                    subCategory: parsedRecipeInfo.subCategory,
                    recipeImg: parsedRecipeInfo.recipeImg,
                    viewCount: parsedRecipeInfo.viewCount || 0,
                    isShare: isShare,
                });
                recipeId = infoAdd._id as Types.ObjectId;
            }

            const recipeIdStr = typeof recipeId === 'string' ? recipeId : recipeId.toString();

            let stepFileIndex = 0;
            for (const step of parsedRecipeSteps) {
                if (step.stepImg === '') {
                    const stepFile = uploadedStepFiles[stepFileIndex];
                    stepFileIndex += 1;
                    if (!stepFile?.path) {
                        throw new Error(`단계 ${step.stepNum}의 이미지가 누락되었습니다.`);
                    }
                    step.stepImg = await finalizeRecipeStepImageFromTemp({
                        tempPath: stepFile.path,
                        categoryKey,
                        recipeId: recipeIdStr,
                        mimetype: stepFile.mimetype,
                    });
                }
            }

            if (parsedIsEdit) {
                for (const imgUrl of deleteImgsArray) {
                    if (!imgUrl) continue;
                    if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
                        try {
                            await deleteObjectByPublicUrlIfManaged(imgUrl);
                        } catch (err) {
                            logger.error('객체 스토리지 이미지 삭제 오류', { error: err });
                            throw err;
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
                        imgUrl.replace(/^\//, '')
                    );
                    try {
                        await fs.unlink(stepImg);
                    } catch (err) {
                        const error = err as NodeJS.ErrnoException;
                        if (error.code !== 'ENOENT') {
                            logger.error('파일 삭제 오류', { error: err });
                            throw err;
                        }
                    }
                }

                await Recipe.updateOne(
                    { userId: userInfo.id, _id: parsedRecipeInfo._id },
                    {
                        $set: {
                            recipeName: parsedRecipeInfo.recipeName,
                            cookTime: parsedRecipeInfo.cookTime,
                            portion: parsedRecipeInfo.portion,
                            portionUnit: parsedRecipeInfo.portionUnit,
                            cookLevel: parsedRecipeInfo.cookLevel,
                            majorCategory: parsedRecipeInfo.majorCategory,
                            subCategory: parsedRecipeInfo.subCategory,
                            recipeImg: parsedRecipeInfo.recipeImg,
                        },
                    }
                );
                await RecipeStep.deleteMany({ recipeId: parsedRecipeInfo._id });
                await RecipeIngredient.deleteMany({ recipeId: parsedRecipeInfo._id });
            }

            // 프론트에서 온 recipeId는 사용하지 않고 서버에서 관리한 recipeId로 통일
            const ingredientsData = parsedRecipeIngredients.map((item) => ({
                recipeId: recipeId,
                sortType: item.sortType,
                ingredientUnit: (item.ingredientUnit || []).map((unit) => ({
                    ingredientName: unit.ingredientName,
                    volume: unit.volume,
                    unit: unit.unit,
                })),
            }));

            const stepsData = parsedRecipeSteps.map((item) => ({
                recipeId: recipeId,
                stepNum: item.stepNum,
                stepWay: item.stepWay,
                stepImg: item.stepImg,
            }));

            await RecipeIngredient.insertMany(ingredientsData);
            await RecipeStep.insertMany(stepsData);

            res.status(200).json({
                error: false,
                message: 'success',
            });
        } catch (parseError) {
            throw handleError(parseError as Error, {
                resourceName: '레시피',
                fileType: '이미지',
            });
        }
    }
);
