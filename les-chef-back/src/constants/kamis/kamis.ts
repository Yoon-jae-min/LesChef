/**
 * KAMIS API 관련 상수
 */

/** 검색 결과로 가격 조회할 최대 품목 수 */
export const MAX_SEARCH_PRICE_ITEMS = 6;

/** 전체 물가 보기용 기본 품목 (검색어 없을 때) */
export const MAIN_INGREDIENTS = [
    '쌀',
    '돼지고기',
    '닭고기',
    '계란',
    '소고기',
    '양파',
    '마늘',
    '배추',
    '고구마',
    '감자',
] as const;

/** 부류 코드 (KAMIS) */
export const KAMIS_CATEGORY = {
    FOOD_CROPS: '100', // 식량작물
    VEGETABLES: '200', // 채소류
    SPECIAL: '300', // 특용작물
    FRUITS: '400', // 과일류
    LIVESTOCK: '500', // 축산물
    SEAFOOD: '600', // 수산물
} as const;

export const KAMIS_DEFAULT_PARAMS = {
    /** 소매 조회 기본 지역: 서울 */
    countryCode: '1101',
    /** kg 환산 여부 */
    convertKgYn: 'N',
    /** 소매가 조회 기간(일) — 최근 N일 */
    retailLookupDays: 10,
} as const;

/** @deprecated 레거시 호환용. 검색 기반에서는 사용하지 않음 */
export const MAX_INGREDIENT_ITEMS = MAX_SEARCH_PRICE_ITEMS;

export const PRICE_DIRECTION = {
    DOWN: '0',
    UP: '1',
    SAME: '2',
} as const;

export type PriceDirection = (typeof PRICE_DIRECTION)[keyof typeof PRICE_DIRECTION];
