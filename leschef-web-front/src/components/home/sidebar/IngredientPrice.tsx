/**
 * 홈 사이드바 — 식재료 가격 검색
 * KAMIS #15 코드매칭 + #17 소매가 조회
 */

"use client";

import Link from "next/link";
import { FormEvent, useId, useState } from "react";
import {
  searchIngredientPrices,
  type IngredientPriceItem,
  type IngredientPriceResponse,
} from "@/utils/api/ingredientPrice";
import ErrorMessage from "@/components/common/ui/ErrorMessage";

interface IngredientPriceProps {
  /** 하위 호환용. 검색 UI에서는 사용하지 않음 */
  initialData?: IngredientPriceResponse | null;
  initialError?: string | null;
}

function formatPrice(item: IngredientPriceItem): string {
  if (typeof item.price === "number") return item.price.toLocaleString();
  if (typeof item.price === "string" && !Number.isNaN(Number(item.price))) {
    return Number(item.price).toLocaleString();
  }
  return "0";
}

export default function IngredientPrice(_props: IngredientPriceProps) {
  const headingId = useId();
  const inputId = useId();
  const resultsId = useId();

  const [inputValue, setInputValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [results, setResults] = useState<IngredientPriceItem[]>([]);
  const [asOfDate, setAsOfDate] = useState("");
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const hasSubmitted = submittedQuery.length > 0;

  const runSearch = async (rawQuery: string) => {
    const query = rawQuery.trim();
    setSubmittedQuery(query);
    setError(null);
    setInfoMessage(null);

    if (!query) {
      setResults([]);
      setAsOfDate("");
      return;
    }

    setIsLoading(true);
    try {
      const res = await searchIngredientPrices(query);
      setResults(res.data || []);
      setAsOfDate(res.date || "");
      setInfoMessage(res.message || null);
    } catch (e) {
      setResults([]);
      setError(e instanceof Error ? e : new Error("검색에 실패했습니다."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void runSearch(inputValue);
  };

  const handleClear = () => {
    setInputValue("");
    setSubmittedQuery("");
    setResults([]);
    setAsOfDate("");
    setInfoMessage(null);
    setError(null);
  };

  return (
    <aside
      className="bg-white rounded-[32px] border border-gray-200 shadow-[6px_6px_0_rgba(0,0,0,0.05)] p-6 sticky top-6"
      aria-labelledby={headingId}
    >
      <h3 id={headingId} className="text-xl font-bold text-gray-900">
        식재료 가격 검색
      </h3>
      <p className="mt-1.5 mb-4 text-sm text-gray-500">
        궁금한 식재료를 입력해 보세요
      </p>

      <form onSubmit={handleSubmit} className="mb-4" role="search" aria-label="식재료 가격 검색">
        <label htmlFor={inputId} className="sr-only">
          식재료 이름
        </label>
        <div className="flex gap-2">
          <input
            id={inputId}
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="예: 고구마, 계란"
            autoComplete="off"
            className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/30"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="shrink-0 rounded-2xl bg-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            {isLoading ? "…" : "검색"}
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="space-y-3" aria-busy="true" aria-live="polite">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {error && !isLoading && (
        <ErrorMessage
          error={error}
          className="text-xs"
          showDetails={false}
          showAction={true}
          onRetry={() => void runSearch(submittedQuery || inputValue)}
        />
      )}

      {!isLoading && !error && !hasSubmitted && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
          식재료 이름을 검색하면
          <br />
          소매 시세가 여기에 표시됩니다
        </div>
      )}

      {!isLoading && !error && hasSubmitted && (
        <div id={resultsId} aria-live="polite">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs text-gray-500">
              &ldquo;{submittedQuery}&rdquo; 검색 결과 · {results.length}건
              {asOfDate ? ` · ${asOfDate}` : ""}
            </p>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-medium text-gray-500 underline-offset-2 hover:text-gray-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded"
            >
              지우기
            </button>
          </div>

          {infoMessage && results.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
              {infoMessage}
            </div>
          )}

          {!infoMessage && results.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
              일치하는 식재료가 없습니다
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-3 mb-4">
              {results.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="p-3 rounded-xl border border-gray-200 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <span className="text-sm font-medium text-gray-900 truncate">{item.name}</span>
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
                        <span aria-hidden>
                          {item.changeRate > 0 ? "↑" : item.changeRate < 0 ? "↓" : "→"}{" "}
                        </span>
                        <span className="sr-only">
                          {item.changeRate > 0
                            ? "상승"
                            : item.changeRate < 0
                              ? "하락"
                              : "변동 없음"}
                          ,{" "}
                        </span>
                        {Math.abs(item.changeRate || 0).toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <p className="text-lg font-bold text-gray-900">{formatPrice(item)}원</p>
                      <p className="text-xs text-gray-600">{item.unit || "단위 정보 없음"}</p>
                    </div>
                    {item.change !== undefined && (
                      <p className="text-xs text-gray-500">전일대비 {item.change}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Link
        href="/ingredient-price"
        className="mt-2 block text-center text-sm text-orange-600 font-medium hover:text-orange-700 transition-colors py-2 border-t border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
      >
        전체 물가 보기<span aria-hidden> →</span>
      </Link>
    </aside>
  );
}
