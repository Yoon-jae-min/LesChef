/**
 * 상수 타입 정의
 */

// 세션 상수
export interface SessionConstants {
    TTL_SECONDS: number;
    MAX_AGE_MS: number;
}

// Rate Limit 상수
export interface RateLimitConstants {
    API: {
        WINDOW_MS: number;
        MAX: number;
        MESSAGE: string;
    };
    AUTH: {
        WINDOW_MS: number;
        MAX: number;
        MESSAGE: string;
    };
    UPLOAD: {
        WINDOW_MS: number;
        MAX: number;
        MESSAGE: string;
    };
}

// KAMIS API 상수
export interface KamisConstants {
    DEFAULT_PARAMS: Record<string, string>;
    MAX_ITEMS: number;
    MAIN_INGREDIENTS: string[];
}

// 캐시 상수
export interface CacheConstants {
    TTL: number;
}
