"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSWRConfig } from "swr";
import { checkLoginStatus, clearAuthStorage } from "@/utils/helpers/authUtils";
import { logout } from "@/utils/api/auth";
import { STORAGE_KEYS } from "@/constants/storage/storageKeys";
import { NAVIGATION_ITEMS, getActiveMenuId } from "@/constants/navigation/navigation";
import { StorageIcon, RecipeIcon, MyPageIcon, BoardIcon } from "./NavigationIcons";
import TopNotificationPopover from "./TopNotificationPopover";

function Top(): React.JSX.Element {
  const pathname = usePathname();
  const { mutate } = useSWRConfig();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const loggedIn = checkLoginStatus();
      setIsLoggedIn(loggedIn);
      setIsAuthReady(true);
    };

    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  // 현재 경로 계산
  const getCurrentPath = useCallback(() => {
    if (typeof window === "undefined") {
      return pathname || "/";
    }
    const queryString = window.location.search;
    const basePath = pathname || "/";
    return queryString ? `${basePath}${queryString}` : basePath;
  }, [pathname]);

  // 로그아웃 핸들러 - useCallback으로 메모이제이션
  const handleLogout = useCallback(async () => {
    const confirmed = window.confirm("로그아웃 하시겠어요?");
    if (!confirmed) {
      return;
    }

    setIsLoggingOut(true);

    try {
      // 백엔드 로그아웃 API 호출 (세션 삭제)
      await logout();
    } catch (error) {
      // 로그아웃 API 실패해도 프론트엔드 정리는 진행
      console.error("로그아웃 API 호출 실패:", error);
    }

    // 프론트엔드 정리
    clearAuthStorage();
    setIsLoggedIn(false);
    // SWR 캐시 무효화하여 로그인 상태 갱신
    mutate("auth_status", { loggedIn: false }, false);

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, [mutate]);

  // 로그인 핸들러 - useCallback으로 메모이제이션
  const handleLogin = useCallback(() => {
    const currentPath = getCurrentPath();
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEYS.RETURN_TO, currentPath);
      sessionStorage.removeItem(STORAGE_KEYS.FROM_SOURCE);
      const loginTarget = `/login?back=${encodeURIComponent(currentPath)}`;
      window.location.href = loginTarget;
    }
  }, [getCurrentPath]);

  // 인증 액션 핸들러 - useCallback으로 메모이제이션
  const handleAuthAction = useCallback(() => {
    if (isLoggedIn) {
      handleLogout();
    } else {
      handleLogin();
    }
  }, [isLoggedIn, handleLogout, handleLogin]);

  // 검색바 토글 핸들러 - useCallback으로 메모이제이션
  const handleToggleSearch = useCallback(() => {
    setIsSearchExpanded((prev) => !prev);
  }, []);

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 py-2 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center max-w-6xl mx-auto h-14 px-4 lg:px-8">
          {/* 로고 */}
          <div className="flex items-center h-full lg:-translate-x-8">
            <Link
              href="/"
              title="홈"
              className="flex items-center h-full group"
              onClick={() => sessionStorage.setItem("fromLogoClick", "true")}
            >
              {/* LesChef 텍스트 로고 */}
              <span className="text-3xl font-bold tracking-normal leading-none text-gray-900 group-hover:text-orange-500 transition-colors duration-200 ml-3 mr-3">
                LesChef
              </span>
            </Link>
          </div>

          {/* 네비게이션 메뉴 아이콘들 */}
          <div className="flex items-center space-x-4 md:space-x-6 lg:space-x-8 ml-4 md:ml-8 lg:ml-16 lg:-translate-x-8">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = getActiveMenuId(pathname || "") === item.id;
              const iconClassName = isActive ? "w-6 h-6 text-orange-600" : "w-6 h-6 text-gray-600";

              // 아이콘 컴포넌트 선택
              let IconComponent: React.ComponentType<{ className?: string }>;
              switch (item.iconId) {
                case "storage":
                  IconComponent = StorageIcon;
                  break;
                case "recipe":
                  IconComponent = RecipeIcon;
                  break;
                case "mypage":
                  IconComponent = MyPageIcon;
                  break;
                case "board":
                  IconComponent = BoardIcon;
                  break;
                default:
                  IconComponent = RecipeIcon;
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  title={item.label}
                  className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-xl transition-all ${
                    isActive ? "bg-orange-100" : "hover:bg-gray-100"
                  }`}
                  aria-label={item.ariaLabel}
                >
                  <IconComponent className={iconClassName} />
                </Link>
              );
            })}
          </div>

          {/* 알림 · 로그인 — 검색창(또는 검색 아이콘) 바로 왼쪽 */}
          <div className="ml-auto flex items-center gap-2 md:gap-3 mr-3 lg:translate-x-8 shrink-0">
            {isAuthReady && isLoggedIn && !isLoggingOut && <TopNotificationPopover />}
            {isAuthReady && !isLoggingOut && (
              <button
                type="button"
                onClick={handleAuthAction}
                title={isLoggedIn ? "로그아웃" : "로그인"}
                className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-xl transition-all"
                aria-label={isLoggedIn ? "로그아웃" : "로그인 페이지로 이동"}
                data-auth-trigger="top"
              >
                {isLoggedIn ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-6 h-6 text-gray-600"
                  >
                    <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" strokeLinecap="round" />
                    <path d="M14 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M19 12H9" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-6 h-6 text-gray-600"
                  >
                    <path d="M15 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" strokeLinecap="round" />
                    <path d="M10 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 12h10" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            )}

            {/* 검색바 - md 이상 */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="검색..."
                  className="w-48 md:w-56 lg:w-72 px-4 py-2 pl-10 bg-gray-100 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm text-gray-900 placeholder:text-gray-600"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-4 h-4 text-gray-400"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 검색 아이콘 - lg 미만 (기존과 동일) */}
            <button
              onClick={handleToggleSearch}
              title="검색"
              className="lg:hidden flex items-center w-8 h-8 justify-center hover:bg-gray-100 rounded-xl transition-all"
              aria-label="검색"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-5 h-5 text-gray-600"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 확장된 검색바 - 모바일에서만 표시 */}
      {isSearchExpanded && (
        <div className="lg:hidden w-full bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="검색..."
                className="w-full px-4 py-3 pl-12 bg-gray-100 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm text-gray-900 placeholder:text-gray-600"
                autoFocus
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="w-5 h-5 text-gray-400"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Top;
