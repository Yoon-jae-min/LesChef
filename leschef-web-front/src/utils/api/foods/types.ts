/**
 * 식재료 관리 API 타입 정의
 */

export type FoodItem = {
  _id: string;
  /** 선택 라벨 (없으면 UI에서 '이름 없음' 등) */
  name: string;
  /** 이미지 URL 또는 `/Image/...` (레거시 문서는 없을 수 있음) */
  imageUrl?: string;
  volume: number;
  unit: string;
  expirate: Date | string;
  daysUntilExpiry?: number;
  status?: "expired" | "urgent" | "warning" | "notice" | "safe";
};

export type StoragePlace = {
  _id: string;
  name: string;
  foodList: FoodItem[];
};

export type FoodsListResponse = {
  error: false;
  sectionList: StoragePlace[];
  result?: boolean | string;
  same?: boolean;
  exist?: boolean;
};

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
