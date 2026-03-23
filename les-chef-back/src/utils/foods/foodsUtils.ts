/**
 * 식재료 관련 유틸리티 함수
 */

import { Types } from 'mongoose';
import { FoodsLean } from '../../models/foods/foodsModel';
import { FoodItem, StoragePlace } from '../../types';
import { getDaysUntilExpiry, getFoodStatus } from '../../constants/foods/foods';

/**
 * FoodsLean 데이터를 StoragePlace 배열로 변환하는 유틸리티 함수
 *
 * MongoDB의 lean() 쿼리 결과를 프론트엔드에서 사용할 수 있는 형식으로 변환합니다.
 *
 * 변환 과정:
 * 1. Mongoose ObjectId를 문자열로 변환 (프론트엔드 호환성)
 * 2. 날짜 문자열을 Date 객체로 변환
 * 3. 선택적으로 유통기한 정보 추가 (daysUntilExpiry, status)
 *
 * @param foodsData - MongoDB에서 조회한 lean 데이터 (null 가능)
 * @param includeExpiryInfo - 유통기한 정보 포함 여부 (기본값: false)
 *                          true인 경우 daysUntilExpiry와 status 필드 추가
 * @returns 변환된 StoragePlace 배열 (빈 배열 반환 가능)
 */
export function mapFoodsDataToStoragePlaces(
    foodsData: FoodsLean | null,
    includeExpiryInfo: boolean = false
): StoragePlace[] {
    if (!foodsData || !foodsData.place) {
        return [];
    }

    return foodsData.place.map((place) => {
        // Mongoose ObjectId를 문자열로 변환 (프론트엔드에서 사용하기 위해)
        const placeId =
            place._id instanceof Types.ObjectId ? place._id.toString() : String(place._id || '');

        return {
            _id: placeId,
            name: place.name || '',
            foodList: place.foodList.map((food) => {
                // 각 식재료의 ObjectId를 문자열로 변환
                const foodId =
                    food._id instanceof Types.ObjectId
                        ? food._id.toString()
                        : String(food._id || '');
                // 유통기한 날짜 객체 생성
                const expiryDate = new Date(food.expirate);

                // 기본 식재료 정보 구성
                const baseFoodItem: FoodItem = {
                    _id: foodId,
                    name: food.name || '',
                    imageUrl: food.imageUrl || '',
                    volume: food.volume || 0,
                    unit: food.unit || '',
                    expirate: expiryDate,
                };

                // 유통기한 정보가 필요한 경우 추가 계산
                // (expiry-alerts 엔드포인트에서 사용)
                if (includeExpiryInfo) {
                    // 오늘부터 유통기한까지 남은 일수 계산
                    baseFoodItem.daysUntilExpiry = getDaysUntilExpiry(expiryDate);
                    // 유통기한 상태 판단 (expired, urgent, warning, notice, safe)
                    baseFoodItem.status = getFoodStatus(expiryDate);
                }

                return baseFoodItem;
            }),
        };
    });
}
