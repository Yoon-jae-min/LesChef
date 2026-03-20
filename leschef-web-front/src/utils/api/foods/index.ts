/**
 * 식재료 관리 API 유틸리티 함수
 * 하위 호환성을 위한 인덱스 파일
 * 모든 타입과 함수를 re-export
 */

// 타입 정의
export type { FoodItem, StoragePlace, FoodsListResponse, ExpiryAlertResponse } from "./types";

// 보관 장소 함수들
export { fetchFoodsList, addStoragePlace, updateStoragePlace, deleteStoragePlace } from "./place";

// 식재료 함수들
export { addFoodItem, updateFoodItem, deleteFoodItem } from "./content";

// 유통기한 알림 함수
export { fetchExpiryAlerts } from "./expiry";
