/**
 * 유통기한 알림 관련 컨트롤러
 * 식재료의 유통기한 상태를 확인하고 알림을 제공
 */

import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Foods, { FoodsLean } from '../../models/foods/foodsModel';
import { handleError } from '../../utils/error/errorUtils';
import { ApiErrorResponse, ExpiryAlertResponse, FoodItem } from '../../types';
import { getDaysUntilExpiry, getFoodStatus } from '../../constants/foods/foods';
import { Types } from 'mongoose';
import { getUserId } from '../../middleware/auth/auth';

/**
 * 유통기한 알림 조회
 * 만료, 긴급(1일), 경고(3일), 알림(7일) 상태의 식재료를 분류하여 반환
 */
interface ExpiryAlertQuery {
    status?: 'expired' | 'urgent' | 'warning' | 'notice' | 'all';
}

export const getExpiryAlerts = asyncHandler(
    async (
        req: Request<{}, ExpiryAlertResponse | ApiErrorResponse, {}, ExpiryAlertQuery>,
        res: Response<ExpiryAlertResponse | ApiErrorResponse>
    ) => {
        try {
            // getUserId는 일반 Request 타입을 받으므로 타입 단언 필요
            const userId = getUserId(req as Request);
            const { status = 'all' } = req.query;
            const foodsData = await Foods.findOne({ userId }).lean<FoodsLean>();

            if (!foodsData || !foodsData.place || foodsData.place.length === 0) {
                res.status(200).json({
                    error: false,
                    expired: [],
                    urgent: [],
                    warning: [],
                    notice: [],
                    totalCount: 0,
                    expiredCount: 0,
                    urgentCount: 0,
                    warningCount: 0,
                    noticeCount: 0,
                });
                return;
            }

            const expired: Array<{ place: string; food: FoodItem }> = [];
            const urgent: Array<{ place: string; food: FoodItem }> = [];
            const warning: Array<{ place: string; food: FoodItem }> = [];
            const notice: Array<{ place: string; food: FoodItem }> = [];

            // 모든 보관 장소와 식재료를 순회하며 상태별로 분류
            for (const place of foodsData.place) {
                if (!place.foodList || place.foodList.length === 0) continue;

                for (const food of place.foodList) {
                    const expiryDate = new Date(food.expirate);
                    const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
                    const foodStatus = getFoodStatus(expiryDate);

                    const foodId =
                        food._id instanceof Types.ObjectId
                            ? food._id.toString()
                            : String(food._id || '');
                    const foodItem: FoodItem = {
                        _id: foodId,
                        name: food.name || '',
                        volume: food.volume || 0,
                        unit: food.unit || '',
                        expirate: expiryDate,
                        daysUntilExpiry,
                        status: foodStatus,
                    };

                    // 상태별로 분류
                    if (status === 'all' || status === foodStatus) {
                        switch (foodStatus) {
                            case 'expired':
                                expired.push({ place: place.name || '', food: foodItem });
                                break;
                            case 'urgent':
                                urgent.push({ place: place.name || '', food: foodItem });
                                break;
                            case 'warning':
                                warning.push({ place: place.name || '', food: foodItem });
                                break;
                            case 'notice':
                                notice.push({ place: place.name || '', food: foodItem });
                                break;
                        }
                    }
                }
            }

            // 날짜순 정렬 (임박한 것부터)
            const sortByExpiry = (a: { food: FoodItem }, b: { food: FoodItem }) => {
                return (a.food.daysUntilExpiry || 0) - (b.food.daysUntilExpiry || 0);
            };

            expired.sort(sortByExpiry);
            urgent.sort(sortByExpiry);
            warning.sort(sortByExpiry);
            notice.sort(sortByExpiry);

            const totalCount = expired.length + urgent.length + warning.length + notice.length;

            res.status(200).json({
                error: false,
                expired,
                urgent,
                warning,
                notice,
                totalCount,
                expiredCount: expired.length,
                urgentCount: urgent.length,
                warningCount: warning.length,
                noticeCount: notice.length,
            });
        } catch (error) {
            throw handleError(error as Error, { resourceName: '식재료 알림' });
        }
    }
);
