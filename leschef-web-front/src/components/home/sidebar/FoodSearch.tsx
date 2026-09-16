/**
 * 홈 사이드바 — 식품 검색 (네이버 쇼핑으로 이동)
 */

"use client";

import { FormEvent, useId, useMemo, useState } from "react";

function buildNaverShoppingUrl(query: string): string {
  return `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(query)}`;
}

export default function FoodSearch() {
  const headingId = useId();
  const inputId = useId();

  const [inputValue, setInputValue] = useState("");
  const chips = useMemo(() => ["두부", "계란", "우유", "김치", "닭가슴살", "즉석밥"], []);

  const openNaverShopping = (rawQuery: string) => {
    const query = rawQuery.trim();
    if (!query) return;
    window.open(buildNaverShoppingUrl(query), "_blank", "noopener,noreferrer");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    openNaverShopping(inputValue);
  };

  return (
    <aside
      className="sticky top-6 rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm shadow-gray-900/5"
      aria-labelledby={headingId}
    >
      <h3 id={headingId} className="text-xl font-bold text-gray-900">
        식품 검색
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-gray-500">
        검색하면 네이버 쇼핑에서 가격을 비교할 수 있습니다.
      </p>

      <form onSubmit={handleSubmit} className="mb-3 mt-4" role="search" aria-label="식품 검색">
        <label htmlFor={inputId} className="sr-only">
          식품 이름
        </label>
        <input
          id={inputId}
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="예: 두부, 김치, 닭가슴살"
          autoComplete="off"
          className="mb-3 w-full rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-green-400 focus:bg-white focus:ring-2 focus:ring-green-500/30"
        />
        <button
          type="submit"
          className="w-full rounded-2xl bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        >
          네이버 쇼핑에서 찾기
        </button>
      </form>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => {
              setInputValue(chip);
              openNaverShopping(chip);
            }}
            className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700 transition-colors hover:border-green-300 hover:bg-green-50 hover:text-green-800"
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
        식재료·식품 이름을 검색하면
        <br />
        네이버 쇼핑 결과가 새 탭에서 열립니다
      </div>
    </aside>
  );
}
