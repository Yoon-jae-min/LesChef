/**
 * 식재료(Content) 관련 컨트롤러
 * 신규: 사진 또는 이름 중 최소 하나 필수
 */

import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Foods, { FoodsLean } from '../../models/foods/foodsModel';
import { handleError } from '../../utils/error/errorUtils';
import { ApiErrorResponse, FoodsListResponse } from '../../types';
import { RESOURCE_ERROR_MESSAGES } from '../../constants/error/errorMessages';
import { getUserId } from '../../middleware/auth/auth';
import { mapFoodsDataToStoragePlaces } from '../../utils/foods/foodsUtils';
import { deleteFoodItemImageIfAny } from '../../utils/foods/foodsItemImageDelete';

interface FoodItemSnapshot {
    name: string;
    imageUrl: string;
    volume: number;
    unit: string;
    expirate: Date;
}

async function findFoodItemSnapshot(
    userId: string,
    contentId: Types.ObjectId
): Promise<FoodItemSnapshot | null> {
    const doc = await Foods.findOne({ userId }).lean<FoodsLean>();
    if (!doc?.place) return null;
    for (const pl of doc.place) {
        for (const f of pl.foodList || []) {
            const fid = f._id instanceof Types.ObjectId ? f._id.toString() : String(f._id || '');
            if (fid === contentId.toString()) {
                return {
                    name: f.name || '',
                    imageUrl: f.imageUrl || '',
                    volume: f.volume ?? 0,
                    unit: f.unit || '',
                    expirate: new Date(f.expirate),
                };
            }
        }
    }
    return null;
}

interface AddContentRequestBody {
    placeId?: string;
    /** 재료명 — 사진이 없을 때는 필수에 가깝게(둘 중 하나 필수) */
    unitName?: string;
    /** 선택: POST /foods/upload-item-image 로 받은 URL (없으면 이름만으로 등록) */
    imageUrl?: string;
    unitVol?: number;
    unitUnit?: string;
    unitDate?: string;
}

export const addContent = asyncHandler(
    async (
        req: Request<{}, FoodsListResponse | ApiErrorResponse, AddContentRequestBody>,
        res: Response<FoodsListResponse | ApiErrorResponse>
    ) => {
        const { placeId, unitName, imageUrl, unitVol, unitUnit, unitDate } = req.body;
        const userId = getUserId(req);

        const img = typeof imageUrl === 'string' ? imageUrl.trim() : '';
        const itemName = (unitName && String(unitName).trim()) || '';
        if (!placeId || !Types.ObjectId.isValid(placeId)) {
            res.status(400).json({
                error: true,
                message: '유효한 보관 장소(placeId)가 필요합니다.',
            });
            return;
        }
        if (!img && !itemName) {
            res.status(400).json({
                error: true,
                message: '사진(imageUrl) 또는 재료 이름(unitName) 중 하나는 입력해주세요.',
            });
            return;
        }

        try {
            const newItem = {
                name: itemName,
                imageUrl: img,
                volume: unitVol ?? 0,
                unit: unitUnit || '',
                expirate: unitDate ? new Date(unitDate) : new Date(),
            };

            const result = await Foods.updateOne(
                { userId, 'place._id': new Types.ObjectId(placeId) },
                { $push: { 'place.$.foodList': newItem } }
            );

            const foodsData = await Foods.findOne({ userId }).lean<FoodsLean>();
            const sectionList = mapFoodsDataToStoragePlaces(foodsData, false);

            if (result.modifiedCount === 0) {
                await deleteFoodItemImageIfAny(img);
                res.status(404).json({
                    error: true,
                    message: RESOURCE_ERROR_MESSAGES.FOODS.PLACE_NOT_FOUND,
                });
            } else {
                res.status(200).json({
                    error: false,
                    result: 'success',
                    sectionList,
                });
            }
        } catch (error) {
            throw handleError(error as Error, { resourceName: '식재료' });
        }
    }
);

interface DeleteContentRequestBody {
    contentId?: string;
}

export const deleteContent = asyncHandler(
    async (
        req: Request<{}, FoodsListResponse | ApiErrorResponse, DeleteContentRequestBody>,
        res: Response<FoodsListResponse | ApiErrorResponse>
    ) => {
        const { contentId } = req.body;
        const userId = getUserId(req);

        if (!contentId || !Types.ObjectId.isValid(contentId)) {
            res.status(400).json({
                error: true,
                message: RESOURCE_ERROR_MESSAGES.FOODS.PLACE_AND_FOOD_NAME_REQUIRED,
            });
            return;
        }

        try {
            const oid = new Types.ObjectId(contentId);
            const beforeSnap = await findFoodItemSnapshot(userId, oid);
            const prevUrl = beforeSnap?.imageUrl || '';

            const result = await Foods.updateOne(
                { userId, 'place.foodList._id': oid },
                { $pull: { 'place.$[pl].foodList': { _id: oid } } },
                { arrayFilters: [{ 'pl.foodList._id': oid }] }
            );

            const foodsData = await Foods.findOne({ userId }).lean<FoodsLean>();
            const sectionList = mapFoodsDataToStoragePlaces(foodsData, false);

            if (result.modifiedCount === 0) {
                res.status(404).json({
                    error: true,
                    message: RESOURCE_ERROR_MESSAGES.FOODS.FOOD_NOT_FOUND,
                });
            } else {
                await deleteFoodItemImageIfAny(prevUrl);
                res.status(200).json({
                    error: false,
                    result: 'success',
                    sectionList,
                });
            }
        } catch (error) {
            throw handleError(error as Error, { resourceName: '식재료' });
        }
    }
);

interface UpdateContentRequestBody {
    name?: string;
    vol?: number;
    unit?: string;
    date?: string;
    contentId?: string;
    /** 새 이미지로 교체 시에만 전달 */
    imageUrl?: string;
}

export const updateContent = asyncHandler(
    async (
        req: Request<{}, FoodsListResponse | ApiErrorResponse, UpdateContentRequestBody>,
        res: Response<FoodsListResponse | ApiErrorResponse>
    ) => {
        const { name, vol, unit, date, contentId, imageUrl } = req.body;
        const userId = getUserId(req);

        if (!contentId) {
            res.status(400).json({
                error: true,
                message: '식재료 ID가 필요합니다.',
            });
            return;
        }

        if (!Types.ObjectId.isValid(contentId)) {
            res.status(400).json({
                error: true,
                message: '유효한 식재료 contentId가 필요합니다.',
            });
            return;
        }

        try {
            const oid = new Types.ObjectId(contentId);
            const before = await findFoodItemSnapshot(userId, oid);
            if (!before) {
                res.status(404).json({
                    error: true,
                    message: RESOURCE_ERROR_MESSAGES.FOODS.FOOD_NOT_FOUND,
                });
                return;
            }

            const nextName = typeof name === 'string' ? name.trim() : before.name;
            const nextVol = typeof vol === 'number' ? vol : before.volume;
            const nextUnit = typeof unit === 'string' ? unit : before.unit;
            const nextDate = date ? new Date(date) : before.expirate;
            const nextImage =
                typeof imageUrl === 'string' && imageUrl.trim()
                    ? imageUrl.trim()
                    : before.imageUrl;

            const nextNameTrimmed = nextName.trim();
            const nextImageTrimmed =
                typeof nextImage === 'string' ? nextImage.trim() : '';
            if (!nextNameTrimmed && !nextImageTrimmed) {
                res.status(400).json({
                    error: true,
                    message: '이름과 사진을 모두 비울 수 없습니다. 둘 중 하나는 유지해주세요.',
                });
                return;
            }

            const result = await Foods.updateOne(
                { userId, 'place.foodList._id': oid },
                {
                    $set: {
                        'place.$[p].foodList.$[f].name': nextNameTrimmed,
                        'place.$[p].foodList.$[f].volume': nextVol,
                        'place.$[p].foodList.$[f].unit': nextUnit,
                        'place.$[p].foodList.$[f].expirate': nextDate,
                        'place.$[p].foodList.$[f].imageUrl': nextImageTrimmed,
                    },
                },
                {
                    arrayFilters: [{ 'p.foodList._id': oid }, { 'f._id': oid }],
                }
            );

            const foodsData = await Foods.findOne({ userId }).lean<FoodsLean>();
            const sectionList = mapFoodsDataToStoragePlaces(foodsData, false);

            if (result.modifiedCount === 0) {
                res.status(404).json({
                    error: true,
                    message: RESOURCE_ERROR_MESSAGES.FOODS.FOOD_NOT_FOUND,
                });
            } else {
                const prevImg = (before.imageUrl || '').trim();
                if (prevImg && prevImg !== nextImageTrimmed) {
                    await deleteFoodItemImageIfAny(before.imageUrl);
                }
                res.status(200).json({
                    error: false,
                    result: true,
                    message: 'success',
                    sectionList,
                });
            }
        } catch (error) {
            throw handleError(error as Error, { resourceName: '식재료' });
        }
    }
);
