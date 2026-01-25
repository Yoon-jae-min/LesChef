/**
 * 식재료 관리 API 타입 정의
 */

// 식재료 항목 타입
export type FoodItem = {
  _id: string;
  name: string;
  volume: number;
  unit: string;
  expirate: Date | string;
  daysUntilExpiry?: number;
  status?: 'expired' | 'urgent' | 'warning' | 'notice' | 'safe';
};

// 보관 장소 타입
export type StoragePlace = {
  _id: string;
  name: string;
  foodList: FoodItem[];
};

// 식재료 목록 응답 타입
export type FoodsListResponse = {
  error: false;
  sectionList: StoragePlace[];
  result?: boolean | string;
  same?: boolean;
  exist?: boolean;
};

// 유통기한 알림 응답 타입
export type ExpiryAlertResponse = {
  error: false;
  expired: Array<{
    place: string;
    food: FoodItem;
  }>;
  urgent: Array<{
    place: string;
    food: FoodItem;
  }>;
  warning: Array<{
    place: string;
    food: FoodItem;
  }>;
  notice: Array<{
    place: string;
    food: FoodItem;
  }>;
  totalCount: number;
  expiredCount: number;
  urgentCount: number;
  warningCount: number;
  noticeCount: number;
};

