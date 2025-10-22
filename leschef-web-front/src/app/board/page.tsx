"use client";

import Top from "@/components/common/top";
import { useState } from "react";
import Link from "next/link";

function BoardPage() {
  const [activeTab, setActiveTab] = useState("notice");

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <Top />
      
      {/* 메인 콘텐츠 */}
      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* 섹션 탭 */}
        <div className="flex items-center justify-center space-x-8 sm:space-x-12 md:space-x-16 mb-8">
          <button
            onClick={() => setActiveTab("notice")}
            className={`text-lg sm:text-xl md:text-2xl font-semibold transition-colors whitespace-nowrap ${
              activeTab === "notice" ? "text-black" : "text-gray-400 hover:text-gray-700"
            }`}
            aria-pressed={activeTab === "notice"}
          >
            공지사항
          </button>
          <button
            onClick={() => setActiveTab("free")}
            className={`text-lg sm:text-xl md:text-2xl font-semibold transition-colors whitespace-nowrap ${
              activeTab === "free" ? "text-black" : "text-gray-400 hover:text-gray-700"
            }`}
            aria-pressed={activeTab === "free"}
          >
            자유게시판
          </button>
        </div>

        {/* 게시판 아이템 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 15 }, (_, index) => (
            <Link key={index} href={`/board/detail?type=${activeTab}`} className="border border-gray-200 p-4 bg-white hover:shadow-md transition-shadow rounded-lg block">
              {/* 제목과 날짜 */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-black">---제목---</h3>
                <span className="text-xs text-gray-400">날짜&시간</span>
              </div>
              
              {/* 내용과 이미지 영역 */}
              <div className="flex justify-between items-start mb-3">
                <p className="text-sm text-black flex-1 mr-2">---내용---</p>
                <div className="w-16 h-16 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-400 text-center">이미지 영역<br/>(존재시)</span>
                </div>
              </div>
              
              {/* 사용자 아이디 */}
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
                <span className="text-xs text-gray-400">아이디</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default BoardPage;
