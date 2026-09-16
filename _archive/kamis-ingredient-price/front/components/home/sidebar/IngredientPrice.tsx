/**
 * 홈 사이드바 — 주요 식재료 공시 시세
 */

"use client";

import { FormEvent, useEffect, useId, useMemo, useState } from "react";
import {
  fetchCuratedIngredientPrices,
  searchIngredientPrices,
  type IngredientPriceItem,
} from "@/utils/api/ingredientPrice";
import ErrorMessage from "@/components/common/ui/ErrorMessage";

function formatPrice(item: IngredientPriceItem): string {
  if (typeof item.price === "number") return item.price.toLocaleString();
  if (typeof item.price === "string" && !Number.isNaN(Number(item.price))) {
    return Number(item.price).toLocaleString();
  }
  return "0";
}

function sourceLabel(source?: string): string | null {
  if (source === "wholesale") return "도매";
  if (source === "retail") return "소매";
  return null;
}

export default function IngredientPrice() {
  const headingId = useId();
  const inputId = useId();
  const resultsId = useId();

  const [inputValue, setInputValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [allItems, setAllItems] = useState<IngredientPriceItem[]>([]);
  const [results, setResults] = useState<IngredientPriceItem[]>([]);
  const [asOfDate, setAsOfDate] = useState("");
  const [disclaimer, setDisclaimer] = useState(
    "KAMIS 공시 시세(참고용)입니다. 마트·온라인 판매가와 다를 수 있습니다."
  );
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hasSubmitted = submittedQuery.length > 0;

  const chips = useMemo(
    () => ["쌀", "고구마", "양파", "마늘", "배추", "소고기"],
    []
  );

  const loadCurated = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchCuratedIngredientPrices();
      setAllItems(res.data || []);
      setResults(res.data || []);
      setAsOfDate(res.date || "");
      if (res.disclaimer) setDisclaimer(res.disclaimer);
      setInfoMessage(res.message || null);
      setSubmittedQuery("");
      setInputValue("");
    } catch (e) {
      setAllItems([]);
      setResults([]);
      setError(e instanceof Error ? e : new Error("시세를 불러오지 못했습니다."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadCurated();
  }, []);

  const runSearch = async (rawQuery: string) => {
    const query = rawQuery.trim();
    setSubmittedQuery(query);
    setError(null);
    setInfoMessage(null);

    if (!query) {
      setResults(allItems);
      return;
    }

    setIsLoading(true);
    try {
      const res = await searchIngredientPrices(query);
      setResults(res.data || []);
      setAsOfDate(res.date || "");
      if (res.disclaimer) setDisclaimer(res.disclaimer);
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
    setResults(allItems);
    setInfoMessage(null);
    setError(null);
  };

  return (
    <aside
      className="sticky top-6 rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm shadow-gray-900/5"
      aria-labelledby={headingId}
    >
      <h3 id={headingId} className="text-xl font-bold text-gray-900">
        주요 식재료 시세
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-gray-500">{disclaimer}</p>

      <form onSubmit={handleSubmit} className="mb-3 mt-4" role="search" aria-label="식재료 시세 검색">
        <label htmlFor={inputId} className="sr-only">
          식재료 이름
        </label>
        <input
          id={inputId}
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="주요 품목에서 찾기"
          autoComplete="off"
          className="mb-3 w-full rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-green-400 focus:bg-white focus:ring-2 focus:ring-green-500/30"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        >
          {isLoading ? "불러오는 중…" : "찾기"}
        </button>
      </form>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => {
              setInputValue(chip);
              void runSearch(chip);
            }}
            className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700 transition-colors hover:border-green-300 hover:bg-green-50 hover:text-green-800"
          >
            {chip}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="space-y-3" aria-busy="true" aria-live="polite">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      )}

      {error && !isLoading && (
        <ErrorMessage
          error={error}
          className="text-xs"
          showDetails={false}
          showAction={true}
          onRetry={() => void (hasSubmitted ? runSearch(submittedQuery || inputValue) : loadCurated())}
        />
      )}

      {!isLoading && !error && (
        <div id={resultsId} aria-live="polite">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs text-gray-500">
              {hasSubmitted ? (
                <>
                  &ldquo;{submittedQuery}&rdquo; · {results.length}건
                </>
              ) : (
                <>주요 품목 · {results.length}건</>
              )}
              {asOfDate ? ` · 기준 ${asOfDate}` : ""}
            </p>
            {hasSubmitted && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded text-xs font-medium text-gray-500 underline-offset-2 hover:text-gray-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              >
                전체 보기
              </button>
            )}
          </div>

          {infoMessage && results.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
              {infoMessage}
            </div>
          )}

          {!infoMessage && results.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
              표시할 시세가 없습니다
            </div>
          )}

          {results.length > 0 && (
            <div className="mb-2 max-h-[28rem] space-y-3 overflow-y-auto pr-1">
              {results.map((item, index) => {
                const channel = sourceLabel(item.source);
                return (
                  <div
                    key={`${item.id || item.name}-${index}`}
                    className="rounded-xl border border-lime-100 bg-white p-3 shadow-sm"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-gray-900">{item.name}</span>
                      {item.changeRate !== undefined && (
                        <span
                          className={`shrink-0 text-xs font-semibold ${
                            item.changeRate > 0
                              ? "text-red-600"
                              : item.changeRate < 0
                                ? "text-green-600"
                                : "text-gray-600"
                          }`}
                        >
                          <span aria-hidden>
                            {item.changeRate > 0 ? "↑" : item.changeRate < 0 ? "↓" : "→"}{" "}
                          </span>
                          {Math.abs(item.changeRate || 0).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-end justify-between gap-2">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{formatPrice(item)}원</p>
                        <p className="text-xs text-gray-600">
                          {item.unit || "단위 정보 없음"}
                          {channel ? ` · ${channel}` : ""}
                          {item.date ? ` · ${item.date}` : ""}
                        </p>
                      </div>
                      {item.change !== undefined && (
                        <p className="text-xs text-gray-500">전일대비 {item.change}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
