/**
 * KAMIS API 관련 상수
 */

// 식재료 목록 최대 반환 개수
export const MAX_INGREDIENT_ITEMS = 8;

// 주요 식재료 목록
export const MAIN_INGREDIENTS = [
    '쌀',
    '돼지고기',
    '닭고기',
    '계란',
    '소고기',
    '양파',
    '마늘',
    '배추',
    '고추',
    '당근',
    '무',
    '상추',
] as const;

// KAMIS 요청 기본 파라미터
export const KAMIS_DEFAULT_PARAMS = {
    productClsCode: '01', // 01: 농산물, 02: 축산물
    itemCategoryCode: '100', // 100: 곡물류 (예시 기본값)
    countyCode: '1101', // 1101: 서울
} as const;

// 가격 변동 방향 상수 (KAMIS API direction 필드 값)
export const PRICE_DIRECTION = {
    DOWN: '0', // 가격 하락
    UP: '1', // 가격 상승
    SAME: '2', // 등락 없음
} as const;

// PRICE_DIRECTION 타입
export type PriceDirection = (typeof PRICE_DIRECTION)[keyof typeof PRICE_DIRECTION];
