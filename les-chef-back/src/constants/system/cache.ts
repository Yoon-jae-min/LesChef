/**
 * 캐시 TTL 관련 상수
 */

export const CACHE_TTL = {
    KAMIS_API: 30 * 60 * 1000, // 30분 (가격)
    KAMIS_PRODUCT_CATALOG: 24 * 60 * 60 * 1000, // 24시간 (품목 코드표)
} as const;
