/**
 * 네비게이션 메뉴 상수 정의
 * 메뉴 순서와 정보를 중앙에서 관리
 */

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  iconId: "storage" | "recipe" | "mypage" | "board";
  ariaLabel: string;
}

/**
 * 네비게이션 메뉴 아이템 정의
 * 식재료 관리가 첫 번째, 레시피가 두 번째로 배치
 */
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: "storage",
    label: "식재료 관리",
    href: "/myPage/storage",
    iconId: "storage",
    ariaLabel: "식재료 관리 페이지로 이동",
  },
  {
    id: "recipe",
    label: "레시피",
    href: "/recipe/korean",
    iconId: "recipe",
    ariaLabel: "레시피 페이지로 이동",
  },
  {
    id: "mypage",
    label: "마이페이지",
    href: "/myPage/info",
    iconId: "mypage",
    ariaLabel: "마이페이지로 이동",
  },
  {
    id: "board",
    label: "게시판",
    href: "/board/notice",
    iconId: "board",
    ariaLabel: "게시판 페이지로 이동",
  },
];

/**
 * 현재 경로에 따라 활성 메뉴 ID 반환
 */
export function getActiveMenuId(pathname: string): string | null {
  for (const item of NAVIGATION_ITEMS) {
    if (pathname.startsWith(item.href)) {
      return item.id;
    }
  }
  return null;
}
