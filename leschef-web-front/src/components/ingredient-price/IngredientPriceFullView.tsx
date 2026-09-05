/**
 * 식재료 물가 전체 보기
 * 기본: 관심 품목 소매가 / 검색: #15+#17 품목 검색
 */

"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import useSWR from "swr";
import Top from "@/components/common/navigation/Top";
import ErrorMessage from "@/components/common/ui/ErrorMessage";
import {
  getIngredientPrices,
  searchIngredientPrices,
  type IngredientPriceItem,
  type IngredientPriceResponse,
} from "@/utils/api/ingredientPrice";
import { TIMING } from "@/constants/system/timing";

function formatPrice(item: IngredientPriceItem): string {
  if (typeof item.price === "number") return item.price.toLocaleString();
  if (typeof item.price === "string" && !Number.isNaN(Number(item.price))) {
    return Number(item.price).toLocaleString();
  }
  return "0";
}

interface IngredientPriceFullViewProps {
  initialData?: IngredientPriceResponse | null;
  initialError?: string | null;
}

export default function IngredientPriceFullView({
  initialData,
  initialError,
}: IngredientPriceFullViewProps) {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchData, setSearchData] = useState<IngredientPriceResponse | null>(null);
  const [searchError, setSearchError] = useState<Error | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const {
    data: priceData,
    error: priceError,
    isLoading,
    mutate,
  } = useSWR<IngredientPriceResponse>("/ingredient-price", getIngredientPrices, {
    revalidateOnFocus: false,
    dedupingInterval: TIMING.ONE_HOUR,
    fallbackData: initialData || undefined,
    shouldRetryOnError: true,
    errorRetryCount: 4,
    errorRetryInterval: 1500,
    revalidateOnReconnect: true,
  });

  const isSearchMode = searchQuery.length > 0;
  const ingredientPrices = isSearchMode
    ? searchData?.data ?? []
    : priceData?.data ?? initialData?.data ?? [];
  const displayError = isSearchMode
    ? searchError
    : priceError || (initialError ? new Error(initialError) : null);
  const asOfDate = isSearchMode
    ? searchData?.date ?? ""
    : priceData?.date ?? initialData?.date ?? "";
  const noticeMessage = isSearchMode
    ? searchData?.message
    : priceData?.message ?? initialData?.message;
  const loading = isSearchMode ? searchLoading : isLoading && !initialData;

  const runSearch = async (qRaw?: string) => {
    const q = (qRaw ?? inputValue).trim();
    if (!q) return;
    setSearchQuery(q);
    setSearchLoading(true);
    setSearchError(null);
    try {
      const res = await searchIngredientPrices(q);
      setSearchData(res);
    } catch (err) {
      setSearchData(null);
      setSearchError(err instanceof Error ? err : new Error("검색에 실패했습니다."));
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    void runSearch();
  };

  const clearSearch = () => {
    setInputValue("");
    setSearchQuery("");
    setSearchData(null);
    setSearchError(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Top />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium">
            홈
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">식재료 물가</span>
        </nav>

        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-gray-400">Market</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">식재료 물가</h1>
          <p className="mt-2 text-sm text-gray-500">
            KAMIS 소매가 기준 · 식재료 이름으로 검색할 수 있습니다
          </p>
          {asOfDate ? <p className="mt-2 text-sm text-gray-500">기준일: {asOfDate}</p> : null}
        </header>

        <form onSubmit={handleSearch} className="mb-8" role="search" aria-label="식재료 가격 검색">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="예: 고구마, 계란, 돼지고기"
              className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/30"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={searchLoading}
                className="rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60"
              >
                검색
              </button>
              {isSearchMode && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  초기화
                </button>
              )}
            </div>
          </div>
        </form>

        {noticeMessage ? (
          <p className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {noticeMessage}
          </p>
        ) : null}

        {isSearchMode && (
          <p className="mb-4 text-sm text-gray-600">
            &ldquo;{searchQuery}&rdquo; 검색 결과 · {ingredientPrices.length}건
          </p>
        )}

        {loading && (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl border border-gray-200 bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        )}

        {displayError && !loading && (
          <div className="space-y-4">
            <ErrorMessage error={displayError} showDetails={false} showAction={false} />
            <button
              type="button"
              onClick={() => {
                if (isSearchMode) void runSearch(searchQuery);
                else void mutate();
              }}
              className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {!loading && !displayError && ingredientPrices.length === 0 && (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center text-gray-600">
            표시할 물가 정보가 없습니다.
          </div>
        )}

        {!displayError && ingredientPrices.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2">
            {ingredientPrices.map((item: IngredientPriceItem, index: number) => (
              <li
                key={`${item.name}-${index}`}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-[4px_4px_0_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                    {item.date ? (
                      <p className="mt-1 text-xs text-gray-500">항목 기준일: {item.date}</p>
                    ) : null}
                  </div>
                  {item.changeRate !== undefined && (
                    <span
                      className={`shrink-0 text-xs font-semibold ${
                        item.changeRate > 0
                          ? "text-red-600"
                          : item.changeRate < 0
                            ? "text-blue-600"
                            : "text-gray-600"
                      }`}
                    >
                      {item.changeRate > 0 ? "↑" : item.changeRate < 0 ? "↓" : "→"}{" "}
                      {Math.abs(item.changeRate || 0).toFixed(1)}%
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-end justify-between gap-2">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(item)}</p>
                    <p className="text-xs text-gray-600">{item.unit || "단위 정보 없음"}</p>
                  </div>
                  {item.change !== undefined && (
                    <p className="text-xs text-gray-500">전일대비 {item.change}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
