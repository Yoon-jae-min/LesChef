/**
 * 식재료 물가 정보 사이드바 컴포넌트
 */

"use client";

import Link from "next/link";
import useSWR from "swr";
import {
  getIngredientPrices,
  type IngredientPriceItem,
  type IngredientPriceResponse,
} from "@/utils/api/ingredientPrice";
import { TIMING } from "@/constants/system/timing";
import ErrorMessage from "@/components/common/ui/ErrorMessage";

interface IngredientPriceProps {
  initialData?: IngredientPriceResponse | null;
  initialError?: string | null;
}

export default function IngredientPrice({ initialData, initialError }: IngredientPriceProps) {
  const {
    data: priceData,
    error: priceError,
    isLoading,
  } = useSWR<IngredientPriceResponse>("/ingredient-price", getIngredientPrices, {
    revalidateOnFocus: false,
    dedupingInterval: TIMING.ONE_HOUR,
    fallbackData: initialData || undefined,
  });

  const ingredientPrices = priceData?.data || initialData?.data || [];
  const displayError = priceError || (initialError ? new Error(initialError) : null);

  // 최대 5개만 표시
  const displayPrices = ingredientPrices.slice(0, 5);

  return (
    <aside className="bg-white rounded-[32px] border border-gray-200 shadow-[6px_6px_0_rgba(0,0,0,0.05)] p-6 sticky top-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">식재료 물가</h3>

      {isLoading && !initialData && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {displayError && !isLoading && (
        <ErrorMessage
          error={displayError}
          className="text-xs"
          showDetails={false}
          showAction={false}
        />
      )}

      {!isLoading && !displayError && displayPrices.length === 0 && (
        <div className="text-center py-8 text-sm text-gray-500">물가 정보가 없습니다.</div>
      )}

      {!isLoading && !displayError && displayPrices.length > 0 && (
        <>
          <div className="space-y-3 mb-4">
            {displayPrices.map((item: IngredientPriceItem, index: number) => (
              <div
                key={`${item.name}-${index}`}
                className="p-3 rounded-xl border border-gray-200 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{item.name}</span>
                  {item.changeRate !== undefined && (
                    <span
                      className={`text-xs font-semibold ${
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
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {typeof item.price === "number"
                        ? item.price.toLocaleString()
                        : typeof item.price === "string" && !isNaN(Number(item.price))
                          ? Number(item.price).toLocaleString()
                          : "0"}
                    </p>
                    <p className="text-xs text-gray-600">{item.unit || "단위 정보 없음"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {ingredientPrices.length > 5 && (
            <Link
              href="/ingredient-price"
              className="block text-center text-sm text-orange-600 font-medium hover:text-orange-700 transition-colors py-2 border-t border-gray-200"
            >
              전체 물가 보기 →
            </Link>
          )}
        </>
      )}
    </aside>
  );
}
