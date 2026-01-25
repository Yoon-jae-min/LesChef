/**
 * 보유 재료 요약 섹션 컴포넌트
 * 보관 장소별 식재료 개수 및 통계 표시
 */

"use client";

import Link from "next/link";
import { useMemo } from "react";
import useSWR from "swr";
import { fetchFoodsList, type FoodsListResponse, type StoragePlace } from "@/utils/api/foods";
import { TIMING } from "@/constants/system/timing";
import ErrorMessage from "@/components/common/ui/ErrorMessage";

interface FoodInventoryProps {
  isLoggedIn?: boolean;
}

export default function FoodInventory({ isLoggedIn = false }: FoodInventoryProps) {
  const { data, error, isLoading } = useSWR<FoodsListResponse>(
    isLoggedIn ? "/foods/place" : null,
    () => fetchFoodsList(),
    {
      dedupingInterval: TIMING.ONE_MINUTE,
      revalidateOnFocus: false,
    }
  );

  if (!isLoggedIn) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">보유 재료 요약</h2>
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-600 mb-4">로그인하시면 우리 집 식재료 현황을 한눈에 볼 수 있어요!</p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-2xl hover:bg-orange-700 transition-colors"
            >
              로그인하고 냉장고 채우기
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">보유 재료 요약</h2>
          <ErrorMessage error={error} showDetails={false} showAction={false} />
        </div>
      </section>
    );
  }

  // 메모이제이션으로 불필요한 재계산 방지
  const places: StoragePlace[] = useMemo(() => data?.sectionList || [], [data?.sectionList]);
  const totalFoods = useMemo(() => {
    return places.reduce((sum, place) => sum + (place.foodList?.length || 0), 0);
  }, [places]);

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">보유 재료 요약</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-gray-50 p-6 animate-pulse h-32"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (places.length === 0) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">보유 재료 요약</h2>
            <Link
              href="/myPage/storage"
              className="text-sm text-orange-600 font-medium hover:text-orange-700 transition-colors"
            >
              식재료 관리하기
            </Link>
          </div>
          <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <p className="text-gray-600 mb-4">등록된 식재료가 없습니다.</p>
            <Link
              href="/myPage/storage"
              className="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-2xl hover:bg-orange-700 transition-colors"
            >
              식재료 등록하기
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">보유 재료 요약</h2>
          <Link
            href="/myPage/storage"
            className="text-sm text-orange-600 font-medium hover:text-orange-700 transition-colors flex items-center gap-1"
          >
            전체보기
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {/* 전체 통계 */}
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">전체 식재료</span>
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalFoods}</p>
            <p className="text-xs text-gray-500 mt-1">개</p>
          </div>

          {/* 보관 장소별 통계 */}
          {places.slice(0, 3).map((place) => (
            <div
              key={place._id}
              className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{place.name}</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-gray-900">{place.foodList?.length || 0}</p>
              <p className="text-xs text-gray-500 mt-1">개</p>
            </div>
          ))}
        </div>

        {/* 보관 장소 목록 */}
        {places.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">보관 장소별 식재료</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {places.map((place) => (
                <Link
                  key={place._id}
                  href="/myPage/storage"
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{place.name}</p>
                    <p className="text-sm text-gray-500">{place.foodList?.length || 0}개</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

