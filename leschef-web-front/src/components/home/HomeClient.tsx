"use client";

import Top from "@/components/common/Top";
import Image from "next/image";
import useSWR from "swr";
import { getIngredientPrices, type IngredientPriceItem, type IngredientPriceResponse } from "@/utils/ingredientPriceApi";
import { TIMING } from "@/constants/timing";

interface HomeClientProps {
  initialData?: IngredientPriceResponse | null;
  initialError?: string | null;
}

function HomeClient({ initialData, initialError }: HomeClientProps) {
  // 식재료 물가 정보 가져오기 - SWR 캐싱 적용
  // 서버에서 가져온 초기 데이터가 있으면 fallbackData로 사용
  const { data: priceData, error: priceError, isLoading: priceLoading } = useSWR<IngredientPriceResponse>(
    '/ingredient-price',
    getIngredientPrices,
    {
      revalidateOnFocus: false,        // 포커스 시 재검증 안 함 (식재료 물가는 자주 변하지 않음)
      dedupingInterval: TIMING.ONE_HOUR,       // 1시간 동안 중복 요청 방지 (전역 설정보다 더 길게)
      fallbackData: initialData || undefined, // 서버에서 가져온 초기 데이터 사용
    }
  );

  const ingredientPrices = priceData?.data || initialData?.data || [];
  const displayError = priceError || (initialError ? new Error(initialError) : null);

  // 초기 데이터 없을 때만 로딩 화면 표시
  if (priceLoading && !initialData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex items-center justify-center relative overflow-hidden">
        {/* 배경 애니메이션 요소들 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-4 h-4 bg-orange-200 rounded-full animate-float [animation-delay:0s]"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-yellow-200 rounded-full animate-float [animation-delay:1s]"></div>
          <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-red-200 rounded-full animate-float [animation-delay:2s]"></div>
          <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-orange-200 rounded-full animate-float [animation-delay:0.5s]"></div>
        </div>

        <div className="text-center relative z-10">
          {/* 로고 애니메이션 - 더 역동적 */}
          <div className="mb-12 animate-logo-entrance">
            <Image 
              src="/icon/LesChef_Logo.png" 
              alt="LesChef Logo" 
              width={112}
              height={112}
              priority
              className="h-28 w-auto mx-auto drop-shadow-xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {/* 요리 아이콘들 - 회전하는 애니메이션 */}
          <div className="flex justify-center mb-8 space-x-6">
            <div className="animate-spin-slow">
              <Image src="/icon/chef_hat.png" alt="셰프 모자" width={32} height={32} priority />
            </div>
            <div className="animate-pulse-gentle">
              <Image src="/icon/refrige.png" alt="냉장고" width={32} height={32} priority />
            </div>
            <div className="animate-spin-slow [animation-direction:reverse]">
              <Image src="/icon/kitchen_utensils.png" alt="주방 용품" width={32} height={32} priority />
            </div>
          </div>

          {/* 로딩 텍스트 */}
          <p className="text-lg font-semibold text-gray-700 animate-pulse">
            LesChef를 준비하는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Top />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">
          식재료 물가 정보
        </h1>

        {priceLoading && !initialData && (
          <div className="text-center py-12 text-sm text-gray-500">
            식재료 물가 정보를 불러오는 중입니다...
          </div>
        )}

        {displayError && !priceLoading && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 text-center max-w-2xl mx-auto">
            {displayError instanceof Error ? displayError.message : "식재료 물가 정보를 불러오지 못했습니다."}
          </div>
        )}

        {!priceLoading && !displayError && ingredientPrices.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-500">
            식재료 물가 정보가 없습니다.
          </div>
        )}

        {!priceLoading && !displayError && ingredientPrices.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ingredientPrices.map((item: IngredientPriceItem, index: number) => (
              <div
                key={`${item.name}-${index}`}
                className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(0,0,0,0.05)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                  {item.changeRate !== undefined && (
                    <span
                      className={`text-sm font-semibold ${
                        item.changeRate > 0
                          ? "text-red-600"
                          : item.changeRate < 0
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {item.changeRate > 0 ? "↑" : item.changeRate < 0 ? "↓" : "→"} {Math.abs(item.changeRate || 0).toFixed(1)}%
                    </span>
                  )}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">
                      {item.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{item.unit}</p>
                  </div>
                  {item.change !== undefined && item.change !== 0 && (
                    <p
                      className={`text-sm font-medium ${
                        item.change > 0 ? "text-red-600" : "text-blue-600"
                      }`}
                    >
                      {item.change > 0 ? "+" : ""}
                      {item.change.toLocaleString()}
                    </p>
                  )}
                </div>
                {item.date && (
                  <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
                    기준일: {new Date(item.date).toLocaleDateString("ko-KR")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default HomeClient;

