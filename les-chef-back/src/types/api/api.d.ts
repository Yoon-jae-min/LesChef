/**
 * API 응답 타입 정의
 */

// 공통 API 응답 형식
export interface ApiResponse<T = unknown> {
    error: boolean;
    message?: string;
    data?: T;
    details?: unknown;
    [key: string]: unknown;
}

// 에러 응답 타입
export interface ApiErrorResponse {
    error: true;
    message: string;
    details?:
        | string
        | string[]
        | Array<{ field: string; fieldName?: string; message: string; value?: unknown }>;
    field?: string;
    fieldName?: string; // 필드명 한글 표시
    value?: unknown;
    duplicateValue?: unknown;
    path?: string;
    maxSize?: number;
    maxSizeMB?: number; // 파일 크기 MB 단위
    maxCount?: number;
    stack?: string;
    originalError?: string;
    text?: boolean | string;
    result?: boolean;
    loggedIn?: boolean;
}

// 성공 응답 타입
export interface ApiSuccessResponse<T = unknown> {
    error: false;
    message?: string;
    data?: T;
    text?: boolean | string;
    result?: boolean;
    [key: string]: unknown;
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
    error: false;
    list: T[];
    page: number;
    limit: number;
    total: number;
}

// 식재료 항목 타입
export interface FoodItem {
    _id: string;
    name: string;
    volume: number;
    unit: string;
    expirate: Date;
    daysUntilExpiry?: number;
    status?: 'expired' | 'urgent' | 'warning' | 'notice' | 'safe';
}

// 보관 장소 타입
export interface StoragePlace {
    _id: string;
    name: string;
    foodList: FoodItem[];
}

// 식재료 목록 응답 타입
export interface FoodsListResponse extends ApiSuccessResponse {
    sectionList: StoragePlace[];
    result?: boolean | string;
    same?: boolean;
    exist?: boolean;
}

// 유통기한 알림 응답 타입
export interface ExpiryAlertResponse extends ApiSuccessResponse {
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
}
