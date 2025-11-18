"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function Top(): React.JSX.Element {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLogin = () => {
            const loggedIn = typeof window !== "undefined" && localStorage.getItem("leschef_is_logged_in") === "true";
            setIsLoggedIn(loggedIn);
        };

        checkLogin();
        window.addEventListener("storage", checkLogin);
        return () => window.removeEventListener("storage", checkLogin);
    }, []);

    const getCurrentPath = () => {
        const queryString = searchParams?.toString();
        const basePath = pathname || "/";
        return queryString ? `${basePath}?${queryString}` : basePath;
    };

    const handleAuthAction = () => {
        if (isLoggedIn) {
            const confirmed = window.confirm("로그아웃 하시겠어요?");
            if (!confirmed) {
                return;
            }
            localStorage.removeItem("leschef_is_logged_in");
            sessionStorage.removeItem("leschef_return_to");
            sessionStorage.removeItem("leschef_from_source");
            setIsLoggedIn(false);
            router.push("/login");
        } else {
            const currentPath = getCurrentPath();
            sessionStorage.setItem("leschef_return_to", currentPath);
            sessionStorage.removeItem("leschef_from_source");
            const loginTarget = `/login?back=${encodeURIComponent(currentPath)}`;
            router.push(loginTarget);
        }
    };

    return (
        <>
        <header className="w-full bg-white border-b border-gray-200 py-2 sticky top-0 z-50 shadow-sm">
            <div className="flex items-center max-w-6xl mx-auto h-14 px-8">
                {/* 로고 */}
                <div className="flex items-center h-full -translate-x-8">
                    <Link 
                        href="/" 
                        className="flex items-center h-full group"
                        onClick={() => sessionStorage.setItem('fromLogoClick', 'true')}
                    >
                        {/* LesChef 텍스트 로고 */}
                        <span className="text-3xl font-bold tracking-normal leading-none text-gray-900 group-hover:text-orange-500 transition-colors duration-200">
                            LesChef
                        </span>
                    </Link>
                </div>

                {/* 아이콘들 */}
                <div className="flex items-center space-x-8 ml-16 -translate-x-8">
                    {/* 요리 아이콘 */}
                    <Link href="/recipe/korean" className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-xl transition-all" aria-label="레시피 페이지로 이동">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-gray-600">
                            {/* 네모 몸체 - 아래 두 모서리만 라운드 처리 */}
                            <path d="M4 13h14v6c0 1-1 2-2 2H6c-1 0-2-1-2-2v-6z" strokeLinecap="round"/>
                            {/* 오른쪽 선분 위로 연장 후 오른쪽 위로 늘림 */}
                            <path d="M18 13v-2l20-4" strokeLinecap="round" strokeLinejoin="round"/>
                            {/* 수증기 - 물결표를 90도로 돌린 모양, 거리 띄움 */}
                            <path d="M6 9c1-1 1-2 1-3c1-1 1-2 1-3" strokeLinecap="round"/>
                            <path d="M10 9c1-1 1-2 1-3c1-1 1-2 1-3" strokeLinecap="round"/>
                            <path d="M14 9c1-1 1-2 1-3c1-1 1-2 1-3" strokeLinecap="round"/>
                        </svg>
                    </Link>

                    {/* 마이페이지 아이콘 */}
                    <Link href="/myPage/info" className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-xl transition-all">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-gray-600">
                            {/* 외부 원 */}
                            <circle cx="12" cy="12" r="10"/>
                            {/* 내부 원 (머리) */}
                            <circle cx="12" cy="9" r="3"/>
                            {/* 어깨선 */}
                            <path d="M7 20c2.5-2.5 7.5-2.5 10 0" strokeLinecap="round"/>
                        </svg>
                    </Link>

                    {/* 게시판 아이콘 */}
                    <Link href="/board/notice" className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-xl transition-all">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-gray-600">
                            {/* 문서 외곽선 */}
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            {/* 텍스트 라인들 */}
                            <path d="M7 8h10M7 12h8M7 16h6" strokeLinecap="round"/>
                        </svg>
                    </Link>

                    {/* 로그인/로그아웃 아이콘 */}
                    <button
                        type="button"
                        onClick={handleAuthAction}
                        className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-xl transition-all"
                        aria-label={isLoggedIn ? "로그아웃" : "로그인 페이지로 이동"}
                        data-auth-trigger="top"
                    >
                        {isLoggedIn ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-gray-600">
                                <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" strokeLinecap="round"/>
                                <path d="M14 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M19 12H9" strokeLinecap="round"/>
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-gray-600">
                                <path d="M15 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" strokeLinecap="round"/>
                                <path d="M10 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M5 12h10" strokeLinecap="round"/>
                            </svg>
                        )}
                    </button>
                </div>

                {/* 검색바 - 데스크톱에서만 표시 */}
                <div className="hidden lg:flex items-center ml-auto translate-x-8">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="검색..." 
                            className="w-72 px-4 py-2 pl-10 bg-gray-100 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm text-gray-900 placeholder:text-gray-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-gray-400">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="m21 21-4.35-4.35"/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* 검색 아이콘 - 모바일에서만 표시 */}
                <button 
                    onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                    className="lg:hidden flex items-center ml-auto mr-4 translate-x-4 w-8 h-8 justify-center hover:bg-gray-100 rounded-xl transition-all"
                    aria-label="검색"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-gray-600">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                </button>
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
                            className="w-full px-4 py-3 pl-12 bg-gray-100 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm text-gray-900 placeholder:text-gray-500"
                            autoFocus
                        />
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-gray-400">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="m21 21-4.35-4.35"/>
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