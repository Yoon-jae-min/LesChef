/**
 * 카테고리 상수
 * 레시피 및 게시판 카테고리 매핑을 중앙 관리
 */

/**
 * 레시피 카테고리를 API 카테고리로 매핑
 */
export const RECIPE_CATEGORY_TO_API: Record<string, string> = {
  korean: "korean",
  japanese: "japanese",
  chinese: "chinese",
  western: "western",
  other: "other",
  etc: "other", // 이전 표기 호환
} as const;

/**
 * 게시판 카테고리 라벨 매핑
 */
export const BOARD_CATEGORY_LABEL: Record<string, string> = {
  notice: "공지",
  free: "자유",
} as const;
