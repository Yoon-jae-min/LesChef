/**
 * 레시피 관련 상수
 */

// 정렬 옵션 타입
export type RecipeSortOption = 'latest' | 'views' | 'popular' | 'rating';

// 정렬 옵션 상수
export const RECIPE_SORT_OPTIONS = {
    LATEST: 'latest' as const,
    VIEWS: 'views' as const,
    POPULAR: 'popular' as const,
    RATING: 'rating' as const,
} as const;

// 정렬 옵션 설명
export const RECIPE_SORT_LABELS: Record<RecipeSortOption, string> = {
    latest: '최신순',
    views: '조회수순',
    popular: '인기순',
    rating: '평점순',
};

// 인기순 점수 계산 가중치
export const POPULARITY_WEIGHTS = {
    VIEW_COUNT: 0.3,      // 조회수 가중치
    RATING: 30,          // 평점 가중치 (0-5점을 0-150점으로 변환)
    REVIEW_COUNT: 2,     // 리뷰 수 가중치
} as const;

// 기본 정렬 옵션
export const DEFAULT_SORT_OPTION: RecipeSortOption = 'latest';

