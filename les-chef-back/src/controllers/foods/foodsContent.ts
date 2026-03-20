/**
 * 식재료(Content) 관련 컨트롤러
 * 보관 장소 내 식재료의 CRUD 작업을 처리
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

interface AddContentRequestBody {
    placeId?: string;
    unitName?: string;
    unitVol?: number;
    unitUnit?: string;
    unitDate?: string;
}

/**
 * 식재료 추가
 */
export const addContent = asyncHandler(
    async (
        req: Request<{}, FoodsListResponse | ApiErrorResponse, AddContentRequestBody>,
        res: Response<FoodsListResponse | ApiErrorResponse>
    ) => {
        const { placeId, unitName, unitVol, unitUnit, unitDate } = req.body;
        const userId = getUserId(req);

        if (!placeId || !Types.ObjectId.isValid(placeId) || !unitName) {
            res.status(400).json({
                error: true,
                message: RESOURCE_ERROR_MESSAGES.FOODS.PLACE_AND_FOOD_NAME_REQUIRED,
            });
            return;
        }

        try {
            const newItem = {
                name: unitName,
                volume: unitVol || 0,
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

/**
 * 식재료 삭제
 */
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
}

/**
 * 식재료 수정
 */
export const updateContent = asyncHandler(
    async (
        req: Request<{}, FoodsListResponse | ApiErrorResponse, UpdateContentRequestBody>,
        res: Response<FoodsListResponse | ApiErrorResponse>
    ) => {
        const { name, vol, unit, date, contentId } = req.body;
        const userId = getUserId(req);

        if (!contentId || !name) {
            res.status(400).json({
                error: true,
                message: RESOURCE_ERROR_MESSAGES.FOODS.PLACE_FOOD_ID_NAME_REQUIRED,
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

            const result = await Foods.updateOne(
                { userId, 'place.foodList._id': oid },
                {
                    $set: {
                        'place.$[p].foodList.$[f].name': name,
                        'place.$[p].foodList.$[f].volume': vol || 0,
                        'place.$[p].foodList.$[f].unit': unit || '',
                        'place.$[p].foodList.$[f].expirate': date ? new Date(date) : new Date(),
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
