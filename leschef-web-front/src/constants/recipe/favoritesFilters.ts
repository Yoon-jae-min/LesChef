/**
 * 마이페이지 찜 레시피 / 나의 레시피 공통 — URL 슬러그·대분류·하위 필터
 * (레시피 목록 API·DB `majorCategory` / `subCategory` 와 동일 한글 값)
 */

export const FAVORITES_CUISINE_TABS = ["한식", "일식", "중식", "양식", "기타"] as const;

export const FAVORITES_SLUG_TO_DISPLAY: Record<string, string> = {
  korean: "한식",
  japanese: "일식",
  chinese: "중식",
  western: "양식",
  etc: "기타",
};

export const FAVORITES_DISPLAY_TO_SLUG: Record<string, string> = {
  한식: "korean",
  일식: "japanese",
  중식: "chinese",
  양식: "western",
  기타: "etc",
};

/** DB `majorCategory` 값 (백엔드 categoryMap과 동일) */
export const FAVORITES_SLUG_TO_MAJOR: Record<string, string> = {
  korean: "한식",
  japanese: "일식",
  chinese: "중식",
  western: "양식",
  etc: "기타",
};

export const FAVORITES_SUBCATEGORIES_BY_MAJOR: Record<string, readonly string[]> = {
  한식: ["전체", "국, 찌개", "밥, 면", "반찬", "기타"],
  일식: ["전체", "국, 전골", "면", "밥", "기타"],
  중식: ["전체", "튀김, 찜", "면", "밥", "기타"],
  양식: ["전체", "스프, 스튜", "면", "빵", "기타"],
  기타: ["전체"],
};

export const FAVORITES_SUB_CATEGORY_QUERY = "subCategory";

export function favoritesMajorFromSlug(slug: string | undefined): string {
  if (!slug) return "한식";
  return FAVORITES_SLUG_TO_MAJOR[slug] ?? "한식";
}

export function favoritesSubFiltersForMajor(majorDisplay: string): string[] {
  const raw = FAVORITES_SUBCATEGORIES_BY_MAJOR[majorDisplay];
  return raw?.length ? [...raw] : ["전체"];
}

export function normalizeFavoritesSubSelection(
  majorDisplay: string,
  subFromUrl: string | null | undefined
): string {
  const allowed = favoritesSubFiltersForMajor(majorDisplay);
  const t = (subFromUrl ?? "").trim();
  if (!t || t === "전체") return "전체";
  return allowed.includes(t) ? t : "전체";
}
