/**
 * 레시피 관련 상수
 */

import type { RecipeSortOption } from "@/types/recipe";

// 정렬 옵션 라벨
export const RECIPE_SORT_LABELS: Record<RecipeSortOption, string> = {
  latest: "최신순",
  views: "조회수순",
  popular: "인기순",
  rating: "평점순",
};

// 기본 정렬 옵션
export const DEFAULT_SORT_OPTION: RecipeSortOption = "latest";

// 레시피 기본값
export const RECIPE_DEFAULTS = {
  COOK_TIME: 30,
  PORTION: 2,
  PORTION_UNIT: "인분",
  COOK_LEVEL: "쉬움",
  MAJOR_CATEGORY: "한식",
  /** 폼 표시값(목록 필터 탭과 동일). API 저장 시 `recipeSubCategoryForApi`로 빈 문자열로 보냄 */
  SUB_CATEGORY: "전체",
  INGREDIENT_UNIT: "개",
  INGREDIENT_GROUP_TYPE: "주재료",
} as const;

// 레시피 옵션 목록
export const RECIPE_OPTIONS = {
  COOK_LEVELS: ["쉬움", "보통", "어려움"] as const,
  PORTION_UNITS: ["인분", "그릇", "개"] as const,
  MAJOR_CATEGORIES: ["한식", "일식", "중식", "양식"] as const,
} as const;

/**
 * 대분류별 세부 카테고리 — 레시피 목록 `recipe/[category]/layout` 필터와 동일
 */
export const RECIPE_SUBCATEGORIES_BY_MAJOR: Record<
  (typeof RECIPE_OPTIONS.MAJOR_CATEGORIES)[number],
  readonly string[]
> = {
  한식: ["전체", "국, 찌개", "밥, 면", "반찬", "기타"],
  일식: ["전체", "국, 전골", "면", "밥", "기타"],
  중식: ["전체", "튀김, 찜", "면", "밥", "기타"],
  양식: ["전체", "스프, 스튜", "면", "빵", "기타"],
};

/** 목록/쿼리와 맞춤: 「전체」는 서버에 빈 문자열로 저장 */
export function recipeSubCategoryForApi(formValue: string): string {
  const v = formValue.trim();
  return v === "전체" || v === "" ? "" : v;
}

/** 상세 응답 → 폼 select 값 */
export function recipeSubCategoryFromApi(apiValue: string | undefined | null): string {
  const v = (apiValue ?? "").trim();
  return v === "" ? "전체" : v;
}

// 레시피 검증 메시지
export const RECIPE_VALIDATION_MESSAGES = {
  NAME_REQUIRED: "레시피 이름을 입력해주세요.",
  INGREDIENT_REQUIRED: "최소 1개 이상의 재료를 입력해주세요.",
  STEP_REQUIRED: "최소 1개 이상의 조리 단계를 입력해주세요.",
} as const;
