"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

function Top(): React.JSX.Element {
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    return (
        <>
        <header className="w-full bg-white border-b border-gray-200 py-2 sticky top-0 z-50">
            <div className="flex items-center max-w-6xl mx-auto h-14 px-8">
                {/* 로고 */}
                <div className="flex items-center h-full -translate-x-8">
                    <Link 
                        href="/" 
                        className="flex items-center h-full"
                        onClick={() => sessionStorage.setItem('fromLogoClick', 'true')}
                    >
                        <Image 
                            src="/icon/LesChef_Logo.png" 
                            alt="LesChef Logo" 
                            width={320}
                            height={96}
                            className="h-16 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                            priority
                        />
                    </Link>
                </div>

                {/* 아이콘들 */}
                <div className="flex items-center space-x-8 ml-16 -translate-x-8">
                    {/* 요리 아이콘 */}
                    <Link href="/recipe" className="w-6 h-6 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity" aria-label="레시피 페이지로 이동">
                        <img src="/icon/recipe_DG.png" alt="레시피" className="w-6 h-6" />
                    </Link>

                    {/* 마이페이지 아이콘 */}
                    <div className="w-6 h-6 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                        <img src="/icon/myPage_DG.png" alt="마이페이지" className="w-6 h-6" />
                    </div>

                    {/* 게시판 아이콘 */}
                    <div className="w-6 h-6 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                        <img src="/icon/board_DG.png" alt="게시판" className="w-6 h-6" />
                    </div>
                </div>

                {/* 검색바 - 데스크톱에서만 표시 */}
                <div className="hidden lg:flex items-center ml-auto translate-x-8">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="검색..." 
                            className="w-72 px-4 py-2 pl-10 bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
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
                    className="lg:hidden flex items-center ml-auto mr-4 translate-x-4 w-8 h-8 justify-center hover:bg-gray-100 rounded transition-colors"
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
                            className="w-full px-4 py-3 pl-12 bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
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