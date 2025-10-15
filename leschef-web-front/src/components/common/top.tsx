import React from "react";
import Image from "next/image";
import Link from "next/link";

function Top(): React.JSX.Element {
    return (
        <header className="w-full bg-white border-b border-gray-200 py-2 sticky top-0 z-50">
            <div className="flex items-center max-w-6xl mx-auto h-14 px-8">
                {/* 로고 */}
                <div className="flex items-center h-full -translate-x-8">
                    <Link href="/" className="flex items-center h-full">
                        <Image 
                            src="/LesChef_Logo.png" 
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
                    {/* 요리 아이콘 (냄비/볼) */}
                    <Link href="/recipe" className="w-5 h-5 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity" aria-label="레시피 페이지로 이동">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-800">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                            <path d="M2 17l10 5 10-5"/>
                            <path d="M2 12l10 5 10-5"/>
                        </svg>
                    </Link>

                    {/* 프로필 아이콘 */}
                    <div className="w-5 h-5 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-800">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                    </div>

                    {/* 메뉴 아이콘 */}
                    <div className="w-5 h-5 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-800">
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <line x1="3" y1="12" x2="21" y2="12"/>
                            <line x1="3" y1="18" x2="21" y2="18"/>
                        </svg>
                    </div>
                </div>

                {/* 검색바 */}
                <div className="flex items-center ml-auto translate-x-8">
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
            </div>
        </header>
    );
}

export default Top;