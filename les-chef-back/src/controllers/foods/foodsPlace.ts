/**
 * 보관 장소 관련 컨트롤러
 * 보관 장소의 CRUD 작업을 처리
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
import logger from '../../utils/system/logger';

/**
 * 식재료 목록 조회
 * 보관 장소별 식재료 목록을 반환하며, 유통기한 정보를 포함
 */
export const getPlace = asyncHandler(
    async (req: Request, res: Response<FoodsListResponse | ApiErrorResponse>) => {
        try {
            const userId = getUserId(req);
            const foodsData = await Foods.findOne({ userId }).lean<FoodsLean>();

            if (!foodsData) {
                res.status(200).json({
                    error: false,
                    sectionList: [],
                });
                return;
            }

            // 유통기한 정보 포함하여 변환
            const sectionList = mapFoodsDataToStoragePlaces(foodsData, true);

            res.status(200).json({
                error: false,
                sectionList,
            });
        } catch (error) {
            throw handleError(error as Error, { resourceName: '식재료' });
        }
    }
);

interface AddPlaceRequestBody {
    placeName?: string;
}

/**
 * 보관 장소 추가
 */
export const addPlace = asyncHandler(
    async (
        req: Request<{}, FoodsListResponse | ApiErrorResponse, AddPlaceRequestBody>,
        res: Response<FoodsListResponse | ApiErrorResponse>
    ) => {
        const { placeName } = req.body;
        const userId = getUserId(req);

        if (!placeName || typeof placeName !== 'string' || placeName.trim() === '') {
            res.status(400).json({
                error: true,
                message: RESOURCE_ERROR_MESSAGES.FOODS.INVALID_PLACE_NAME_REQUIRED,
            });
            return;
        }

        try {
            const exist = await Foods.findOne({ userId });
            let duplicate = false;

            if (exist) {
                duplicate = exist.place.some((place) => place.name === placeName);

                if (!duplicate) {
                    await Foods.updateOne(
                        { userId },
                        {
                            $push: {
                                place: {
                                    name: placeName,
                                    foodList: [],
                                },
                            },
                            $set: {
                                updateAt: new Date().setMilliseconds(0),
                            },
                        }
                    );
                }
            } else {
                await Foods.create({
                    userId,
                    place: [
                        {
                            name: placeName,
                            foodList: [],
                        },
                    ],
                });
            }

            const foodsData = await Foods.findOne({ userId }).lean<FoodsLean>();
            const sectionList = mapFoodsDataToStoragePlaces(foodsData, false);

            res.status(200).json({
                error: false,
                result: duplicate,
                sectionList,
            } as FoodsListResponse);
        } catch (error) {
            throw handleError(error as Error, { resourceName: '식재료' });
        }
    }
);

interface UpdatePlaceRequestBody {
    /** 보관 장소 서브도큐먼트 MongoDB _id */
    placeId?: string;
    changeName?: string;
}

/**
 * 보관 장소 수정
 */
export const updatePlace = asyncHandler(
    async (
        req: Request<{}, FoodsListResponse | ApiErrorResponse, UpdatePlaceRequestBody>,
        res: Response<FoodsListResponse | ApiErrorResponse>
    ) => {
        const { placeId, changeName } = req.body;
        const userId = getUserId(req);

        if (!changeName || typeof changeName !== 'string' || !changeName.trim()) {
            res.status(400).json({
                error: true,
                message: RESOURCE_ERROR_MESSAGES.FOODS.PLACE_NAMES_REQUIRED,
            });
            return;
        }

        const trimmedNew = changeName.trim();

        if (!placeId || !Types.ObjectId.isValid(placeId)) {
            res.status(400).json({
                error: true,
                message: '유효한 placeId가 필요합니다.',
            });
            return;
        }

        try {
            const doc = await Foods.findOne({ userId }).lean<FoodsLean>();
            if (!doc || !doc.place?.length) {
                res.status(404).json({
                    error: true,
                    message: RESOURCE_ERROR_MESSAGES.FOODS.PLACE_NOT_FOUND,
                });
                return;
            }

            const pl = doc.place.find((p) => p._id.toString() === placeId);
            if (!pl) {
                res.status(404).json({
                    error: true,
                    message: RESOURCE_ERROR_MESSAGES.FOODS.PLACE_NOT_FOUND,
                });
                return;
            }
            const currentName = pl.name;

            if (currentName === trimmedNew) {
                res.status(200).json({
                    error: false,
                    same: true,
                    exist: false,
                    sectionList: [],
                } as FoodsListResponse);
                return;
            }

            const nameTaken = doc.place.some(
                (p) => p.name === trimmedNew && p.name !== currentName
            );
            if (nameTaken) {
                res.status(200).json({
                    error: false,
                    same: false,
                    exist: true,
                    sectionList: [],
                } as FoodsListResponse);
                return;
            }

            const result = await Foods.updateOne(
                { userId, 'place._id': new Types.ObjectId(placeId) },
                {
                    $set: {
                        'place.$.name': trimmedNew,
                        updateAt: new Date().setMilliseconds(0),
                    },
                }
            );

            if (result.modifiedCount > 0) {
                const foodsData = await Foods.findOne({ userId }).lean<FoodsLean>();
                const sectionList = mapFoodsDataToStoragePlaces(foodsData, false);

                res.status(200).json({
                    error: false,
                    same: false,
                    exist: false,
                    sectionList,
                });
            } else {
                res.status(404).json({
                    error: true,
                    message: RESOURCE_ERROR_MESSAGES.FOODS.PLACE_NOT_FOUND,
                });
            }
        } catch (err) {
            logger.error('보관 장소 수정 오류:', { error: err });
            throw err;
        }
    }
);

interface DeletePlaceRequestBody {
    placeId?: string;
}

/**
 * 보관 장소 삭제
 */
export const deletePlace = asyncHandler(
    async (
        req: Request<{}, FoodsListResponse | ApiErrorResponse, DeletePlaceRequestBody>,
        res: Response<FoodsListResponse | ApiErrorResponse>
    ) => {
        const { placeId } = req.body;
        const userId = getUserId(req);

        if (!placeId || !Types.ObjectId.isValid(placeId)) {
            res.status(400).json({
                error: true,
                message: RESOURCE_ERROR_MESSAGES.FOODS.PLACE_NAME_REQUIRED,
            });
            return;
        }

        try {
            const result = await Foods.updateOne(
                { userId },
                { $pull: { place: { _id: new Types.ObjectId(placeId) } } }
            );
            const foodsData = await Foods.findOne({ userId }).lean<FoodsLean>();
            const sectionList = mapFoodsDataToStoragePlaces(foodsData, false);

            if (result.modifiedCount > 0) {
                res.status(200).json({
                    error: false,
                    sectionList,
                });
            } else {
                res.status(404).json({
                    error: true,
                    message: RESOURCE_ERROR_MESSAGES.FOODS.PLACE_NOT_FOUND,
                });
            }
        } catch (error) {
            throw handleError(error as Error, { resourceName: '식재료' });
        }
    }
);
