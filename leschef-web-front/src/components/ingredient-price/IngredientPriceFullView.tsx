/**
 * 식재료 물가 전체 보기 (메인 사이드바 → 전체 물가 보기)
 */

"use client";

import Link from "next/link";
import useSWR from "swr";
import Top from "@/components/common/navigation/Top";
import ErrorMessage from "@/components/common/ui/ErrorMessage";
import {
  getIngredientPrices,
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
  const {
    data: priceData,
    error: priceError,
    isLoading,
  } = useSWR<IngredientPriceResponse>("/ingredient-price", getIngredientPrices, {
    revalidateOnFocus: false,
    dedupingInterval: TIMING.ONE_HOUR,
    fallbackData: initialData || undefined,
  });

  const ingredientPrices = priceData?.data ?? initialData?.data ?? [];
  const displayError = priceError || (initialError ? new Error(initialError) : null);
  const asOfDate = priceData?.date ?? initialData?.date ?? "";
  const noticeMessage = priceData?.message ?? initialData?.message;

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
          {asOfDate ? (
            <p className="mt-2 text-sm text-gray-500">기준일: {asOfDate}</p>
          ) : null}
          {noticeMessage ? (
            <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {noticeMessage}
            </p>
          ) : null}
        </header>

        {isLoading && !initialData && (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl border border-gray-200 bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {displayError && !isLoading && (
          <ErrorMessage error={displayError} showDetails={false} showAction={false} />
        )}

        {!isLoading && !displayError && ingredientPrices.length === 0 && (
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
