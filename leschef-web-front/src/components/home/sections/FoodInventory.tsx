/**
 * 보유 재료 요약 섹션
 */

"use client";

import Link from "next/link";
import { useId, useMemo } from "react";
import useSWR from "swr";
import { fetchFoodsList, type FoodsListResponse, type StoragePlace } from "@/utils/api/foods";
import { TIMING } from "@/constants/system/timing";
import ErrorMessage from "@/components/common/ui/ErrorMessage";

interface FoodInventoryProps {
  isLoggedIn?: boolean;
  authLoading?: boolean;
  /** 홈 3열용 — 총 보유 개수 카드 중심 */
  embedded?: boolean;
}

export default function FoodInventory({
  isLoggedIn = false,
  authLoading = false,
  embedded = false,
}: FoodInventoryProps) {
  const sectionTitleId = useId();
  const subsectionTitleId = useId();
  const { data, error, isLoading, mutate } = useSWR<FoodsListResponse>(
    isLoggedIn ? "/foods/place" : null,
    () => fetchFoodsList(),
    {
      dedupingInterval: TIMING.ONE_MINUTE,
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 1500,
      revalidateOnReconnect: true,
    }
  );

  const places: StoragePlace[] = useMemo(() => data?.sectionList || [], [data?.sectionList]);
  const totalFoods = useMemo(() => {
    return places.reduce((sum, place) => sum + (place.foodList?.length || 0), 0);
  }, [places]);

  const sectionClass = embedded ? "py-0" : "py-8";
  const innerClass = embedded ? "" : "max-w-7xl mx-auto px-6";
  const titleClass = embedded
    ? "text-xl font-bold text-gray-900"
    : "text-2xl font-bold text-gray-900 mb-4";

  const wrap = (children: React.ReactNode, busy?: boolean) => (
    <section
      className={sectionClass}
      aria-labelledby={sectionTitleId}
      {...(busy ? { "aria-busy": true as const, "aria-live": "polite" as const } : {})}
    >
      <div className={innerClass}>{children}</div>
    </section>
  );

  if (authLoading) {
    return wrap(
      <>
        <h2 id={sectionTitleId} className={titleClass}>
          보유 재료 요약
        </h2>
        <div className="h-24 animate-pulse rounded-2xl border border-gray-200 bg-gray-50" />
      </>,
      true
    );
  }

  if (!isLoggedIn) {
    return wrap(
      <>
        <h2 id={sectionTitleId} className={titleClass}>
          보유 재료 요약
        </h2>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center">
          <p className="mb-3 text-sm text-gray-600">
            로그인하시면 우리 집 식재료 현황을 한눈에 볼 수 있어요!
          </p>
          <Link
            href="/login"
            className="inline-block rounded-2xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            로그인하고 냉장고 채우기
          </Link>
        </div>
      </>
    );
  }

  if (error) {
    return wrap(
      <>
        <h2 id={sectionTitleId} className={titleClass}>
          보유 재료 요약
        </h2>
        <ErrorMessage
          error={error}
          showDetails={false}
          showAction={true}
          onRetry={() => void mutate()}
        />
      </>
    );
  }

  if (isLoading) {
    return wrap(
      <>
        <h2 id={sectionTitleId} className={titleClass}>
          보유 재료 요약
        </h2>
        <div className="h-24 animate-pulse rounded-2xl border border-gray-200 bg-gray-50" />
      </>,
      true
    );
  }

  if (embedded) {
    return wrap(
      <>
        <h2 id={sectionTitleId} className={`${titleClass} mb-3`}>
          보유 재료 요약
        </h2>
        <Link
          href="/myPage/storage"
          className="flex items-center gap-3 rounded-2xl border border-lime-100 bg-gradient-to-r from-lime-50 to-green-50 p-4 transition-colors hover:border-green-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        >
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm"
            aria-hidden
          >
            <svg viewBox="0 0 40 40" className="h-8 w-8" fill="none">
              <circle cx="20" cy="20" r="14" fill="#C8E86A" />
              <circle cx="20" cy="20" r="9" fill="#EAF8C8" />
              <path
                d="M20 11 L22 20 L20 29 L18 20 Z M11 20 L20 22 L29 20 L20 18 Z"
                fill="#7BC24A"
                fillOpacity="0.45"
              />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-base font-semibold text-gray-900">
              총 보유 재료 {totalFoods}개
            </p>
            <p className="text-xs text-gray-500">
              {places.length > 0
                ? `${places.length}개 보관 장소 · 식재료 관리`
                : "식재료 관리로 이동"}
            </p>
          </div>
        </Link>
      </>
    );
  }

  if (places.length === 0) {
    return wrap(
      <>
        <div className="mb-4 flex items-center justify-between">
          <h2 id={sectionTitleId} className="text-2xl font-bold text-gray-900">
            보유 재료 요약
          </h2>
          <Link
            href="/myPage/storage"
            className="rounded-lg text-sm font-medium text-green-600 transition-colors hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            식재료 관리하기
          </Link>
        </div>
        <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <p className="mb-4 text-gray-600">등록된 식재료가 없습니다.</p>
          <Link
            href="/myPage/storage"
            className="inline-block rounded-2xl bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            식재료 등록하기
          </Link>
        </div>
      </>
    );
  }

  return wrap(
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 id={sectionTitleId} className="text-2xl font-bold text-gray-900">
          보유 재료 요약
        </h2>
        <Link
          href="/myPage/storage"
          className="flex items-center gap-1 rounded-lg text-sm font-medium text-green-600 transition-colors hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        >
          전체보기
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-yellow-50 p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">전체 식재료</span>
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalFoods}</p>
          <p className="mt-1 text-xs text-gray-500">개</p>
        </div>

        {places.slice(0, 3).map((place) => (
          <div
            key={place._id}
            className="rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">{place.name}</span>
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{place.foodList?.length || 0}</p>
            <p className="mt-1 text-xs text-gray-500">개</p>
          </div>
        ))}
      </div>

      {places.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 id={subsectionTitleId} className="mb-4 text-lg font-semibold text-gray-900">
            보관 장소별 식재료
          </h3>
          <div
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            aria-labelledby={subsectionTitleId}
          >
            {places.map((place) => (
              <Link
                key={place._id}
                href="/myPage/storage"
                className="flex items-center justify-between rounded-xl border border-gray-200 p-3 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                aria-label={`${place.name}, ${place.foodList?.length || 0}개 · 식재료 관리`}
              >
                <div>
                  <p className="font-medium text-gray-900">{place.name}</p>
                  <p className="text-sm text-gray-500">{place.foodList?.length || 0}개</p>
                </div>
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
