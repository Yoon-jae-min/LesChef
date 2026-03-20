"use client";

import { useState, useCallback, useEffect } from "react";

interface SearchBarProps {
  onSearch?: (keyword: string) => void;
  initialKeyword?: string;
  className?: string;
}

/**
 * 레시피 검색바 컴포넌트
 */
export default function SearchBar({
  onSearch,
  initialKeyword = "",
  className = "",
}: SearchBarProps) {
  const [keyword, setKeyword] = useState(initialKeyword);

  // URL 파라미터에서 검색어 가져오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlKeyword = params.get("keyword") || "";
      if (urlKeyword && urlKeyword !== keyword) {
        setKeyword(urlKeyword);
      }
    }
  }, []);

  // 검색 실행
  const handleSearch = useCallback(
    (searchKeyword: string) => {
      if (onSearch) {
        onSearch(searchKeyword);
      } else {
        // 기본 동작: URL에 검색어 추가
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          if (searchKeyword.trim()) {
            params.set("keyword", searchKeyword.trim());
          } else {
            params.delete("keyword");
          }
          const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
          window.history.pushState({}, "", newUrl);
          // 페이지 새로고침 없이 URL만 변경
          window.dispatchEvent(new PopStateEvent("popstate"));
        }
      }
    },
    [onSearch]
  );

  // Enter 키 처리
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch(keyword);
      }
    },
    [keyword, handleSearch]
  );

  // 검색 버튼 클릭
  const handleSearchClick = useCallback(() => {
    handleSearch(keyword);
  }, [keyword, handleSearch]);

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="레시피 이름, 재료명, 태그로 검색..."
        className="w-full px-4 py-2 pl-10 pr-10 bg-gray-100 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900 placeholder:text-gray-500"
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
      {keyword && (
        <button
          onClick={handleSearchClick}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-200 rounded-r-2xl transition-colors"
          aria-label="검색"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5 text-gray-600"
          >
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
