/**
 * 홈 사이드바 — 식품/음식 네이버 쇼핑 검색
 */

"use client";

import { FormEvent, useId, useMemo, useState } from "react";
import { searchFoodProducts, type FoodSearchItem } from "@/utils/api/foodSearch";
import ErrorMessage from "@/components/common/ui/ErrorMessage";

function formatPrice(price: number): string {
  if (!price || Number.isNaN(price)) return "-";
  return price.toLocaleString();
}

export default function FoodSearch() {
  const headingId = useId();
  const inputId = useId();
  const resultsId = useId();

  const [inputValue, setInputValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [results, setResults] = useState<FoodSearchItem[]>([]);
  const [total, setTotal] = useState(0);
  const [disclaimer, setDisclaimer] = useState(
    "네이버 쇼핑 검색 결과입니다. 가격·재고는 쇼핑몰 기준으로 달라질 수 있습니다."
  );
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const hasSubmitted = submittedQuery.length > 0;
  const chips = useMemo(() => ["두부", "계란", "우유", "김치", "닭가슴살", "즉석밥"], []);

  const runSearch = async (rawQuery: string) => {
    const query = rawQuery.trim();
    setSubmittedQuery(query);
    setError(null);
    setInfoMessage(null);

    if (!query) {
      setResults([]);
      setTotal(0);
      return;
    }

    setIsLoading(true);
    try {
      const res = await searchFoodProducts(query);
      setResults(res.data || []);
      setTotal(res.total || 0);
      if (res.disclaimer) setDisclaimer(res.disclaimer);
      setInfoMessage(res.message || null);
    } catch (e) {
      setResults([]);
      setTotal(0);
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
    setTotal(0);
    setInfoMessage(null);
    setError(null);
  };

  return (
    <aside
      className="sticky top-6 rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm shadow-gray-900/5"
      aria-labelledby={headingId}
    >
      <h3 id={headingId} className="text-xl font-bold text-gray-900">
        식품 검색
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-gray-500">{disclaimer}</p>

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
          disabled={isLoading}
          className="w-full rounded-2xl bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        >
          {isLoading ? "검색 중…" : "검색"}
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
            <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />
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
          식품·식재료 이름을 검색하면
          <br />
          네이버 쇼핑 결과가 표시됩니다
        </div>
      )}

      {!isLoading && !error && hasSubmitted && (
        <div id={resultsId} aria-live="polite">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs text-gray-500">
              &ldquo;{submittedQuery}&rdquo; · {results.length}건
              {total > results.length ? ` (전체 ${total.toLocaleString()})` : ""}
            </p>
            <button
              type="button"
              onClick={handleClear}
              className="rounded text-xs font-medium text-gray-500 underline-offset-2 hover:text-gray-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
            >
              지우기
            </button>
          </div>

          {infoMessage && results.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
              {infoMessage}
            </div>
          )}

          {results.length > 0 && (
            <div className="mb-2 max-h-[28rem] space-y-3 overflow-y-auto pr-1">
              {results.map((item) => (
                <a
                  key={`${item.productId}-${item.link}`}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-lime-100 bg-white p-3 shadow-sm transition-colors hover:border-green-300 hover:bg-green-50/40"
                >
                  <div className="flex gap-3">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt=""
                        className="h-16 w-16 shrink-0 rounded-lg object-cover bg-gray-100"
                      />
                    ) : (
                      <div className="h-16 w-16 shrink-0 rounded-lg bg-gray-100" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="mt-1 text-base font-bold text-gray-900">
                        {formatPrice(item.lprice)}원
                      </p>
                      <p className="text-xs text-gray-500">{item.mallName || "쇼핑몰"}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
