"use client";

import { useState, useCallback, useEffect, useId } from "react";

interface SearchBarProps {
  onSearch?: (keyword: string) => void;
  initialKeyword?: string;
  className?: string;
  /** hero: 메인 히어로용 큰 검색 + 초록 검색 버튼 */
  variant?: "default" | "hero";
}

/**
 * 레시피 검색바 컴포넌트
 */
export default function SearchBar({
  onSearch,
  initialKeyword = "",
  className = "",
  variant = "default",
}: SearchBarProps) {
  const searchFieldId = useId();
  const [keyword, setKeyword] = useState(initialKeyword);

  useEffect(() => {
    setKeyword(initialKeyword);
  }, [initialKeyword]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlKeyword = params.get("keyword") || "";
      if (urlKeyword && urlKeyword !== keyword) {
        setKeyword(urlKeyword);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- URL 최초 동기화만
  }, []);

  const handleSearch = useCallback(
    (searchKeyword: string) => {
      if (onSearch) {
        onSearch(searchKeyword);
      } else if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        if (searchKeyword.trim()) {
          params.set("keyword", searchKeyword.trim());
        } else {
          params.delete("keyword");
        }
        const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
        window.history.pushState({}, "", newUrl);
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
    },
    [onSearch]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch(keyword);
      }
    },
    [keyword, handleSearch]
  );

  const handleSearchClick = useCallback(() => {
    handleSearch(keyword);
  }, [keyword, handleSearch]);

  if (variant === "hero") {
    return (
      <div className={`relative ${className}`}>
        <label htmlFor={searchFieldId} className="sr-only">
          레시피 검색
        </label>
        <div className="flex overflow-hidden rounded-2xl border border-green-100 bg-white shadow-md shadow-green-900/5">
          <input
            id={searchFieldId}
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="레시피 이름, 재료명, 태그로 검색..."
            enterKeyHint="search"
            autoComplete="off"
            className="min-w-0 flex-1 border-0 bg-transparent px-5 py-4 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0"
          />
          <button
            type="button"
            onClick={handleSearchClick}
            className="flex shrink-0 items-center justify-center bg-green-600 px-5 text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-inset"
            aria-label="검색 실행"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
              aria-hidden
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={searchFieldId} className="sr-only">
        레시피 검색
      </label>
      <input
        id={searchFieldId}
        type="search"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="레시피 이름, 재료명, 태그로 검색..."
        enterKeyHint="search"
        autoComplete="off"
        className="w-full rounded-2xl border border-lime-100 bg-white px-4 py-2 pl-10 pr-10 text-sm text-gray-900 shadow-sm placeholder:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-4 w-4 text-gray-400"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      {keyword && (
        <button
          type="button"
          onClick={handleSearchClick}
          className="absolute inset-y-0 right-0 flex items-center rounded-r-2xl pr-3 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-inset"
          aria-label="검색 실행"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5 text-gray-600"
          >
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
