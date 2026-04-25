/**
 * 메인 페이지 클라이언트 컴포넌트
 * 식재료 관리 중심의 대시보드 구성
 */

"use client";

import Top from "@/components/common/navigation/Top";
import HeroSection from "./sections/HeroSection";
import ExpiryAlerts from "./sections/ExpiryAlerts";
import FoodInventory from "./sections/FoodInventory";
import RecipeSection from "./sections/RecipeSection";
import CategoryPreview from "./sections/CategoryPreview";
import IngredientPrice from "./sidebar/IngredientPrice";
import { useExpiryAlerts } from "@/hooks/useExpiryAlerts";
import type { IngredientPriceResponse } from "@/utils/api/ingredientPrice";
import useSWR from "swr";
import { checkAuth } from "@/utils/api/auth";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { STORAGE_KEYS } from "@/constants/storage/storageKeys";

interface HomeClientProps {
  priceInitialData?: IngredientPriceResponse | null;
  priceInitialError?: string | null;
}

export default function HomeClient({ priceInitialData, priceInitialError }: HomeClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // SNS 로그인 콜백 여부 판단 (카카오/구글/네이버 공통)
  const userIdParam = searchParams.get("userId");
  const nameParam = searchParams.get("name");
  const nickNameParam = searchParams.get("nickName");
  const telParam = searchParams.get("tel");
  const isSnsCallback = !!userIdParam && !!nickNameParam;

  // 로그인 상태 확인 (isLoading 추가)
  const { data: authData, isLoading: isAuthLoading } = useSWR("auth_status", checkAuth);
  // 로딩 중이 아니고 데이터가 있으며 loggedIn이 true일 때만 실제 로그인으로 간주
  const isLoggedIn = !isAuthLoading && authData?.loggedIn === true;

  // SNS 로그인(카카오/구글/네이버) 성공 후 리다이렉트 처리
  useEffect(() => {
    // URL 파라미터에 사용자 정보가 있으면 SNS 로그인 성공 처리
    if (isSnsCallback && userIdParam && nickNameParam) {
      try {
        // 로컬 스토리지에 로그인 상태 및 사용자 정보 저장
        localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, "true");
        localStorage.setItem(
          STORAGE_KEYS.CURRENT_USER,
          JSON.stringify({
            id: userIdParam,
            name: nameParam || "user",
            nickName: nickNameParam,
            tel: telParam || "",
          })
        );

        // 전체 페이지 새로고침으로 Top 컴포넌트의 로그인 상태도 반영
        if (typeof window !== "undefined") {
          window.location.href = "/";
        } else {
          // SSR 안전을 위해 fallback
          router.replace("/");
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("카카오 로그인 후 처리 오류:", error);
        }
      }
    }
  }, [isSnsCallback, userIdParam, nameParam, nickNameParam, telParam, router]);

  // SNS 로그인 콜백 처리 중일 때는 전체 화면 로딩만 보여주고, 본문은 렌더하지 않음
  if (isSnsCallback) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div
          className="flex flex-col items-center gap-3 text-gray-500 text-sm"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div
            className="h-8 w-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"
            aria-hidden
          />
          <span>SNS 로그인 처리 중입니다...</span>
        </div>
      </div>
    );
  }

  // 유통기한 알림 모니터링 (백그라운드에서 실행 - 로그인 시에만)
  useExpiryAlerts(isLoggedIn);

  return (
    <div className="min-h-screen bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-gray-900 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        본문으로 건너뛰기
      </a>
      <Top />

      {/* 히어로 섹션 */}
      <HeroSection />

      {/* 메인 콘텐츠 영역 */}
      <main id="main-content" className="max-w-7xl mx-auto px-6 py-12 outline-none" tabIndex={-1}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 콘텐츠 (3열) */}
          <div className="lg:col-span-3 space-y-8">
            {/* 유통기한 임박 알림 섹션 */}
            <ExpiryAlerts isLoggedIn={isLoggedIn} authLoading={isAuthLoading} />

            {/* 보유 재료 요약 섹션 */}
            <FoodInventory isLoggedIn={isLoggedIn} authLoading={isAuthLoading} />

            {/* 레시피 섹션 (서브 - 더 작게) */}
            <div
              className="pt-12 border-t-2 border-gray-200"
              aria-labelledby="home-recipe-explore-heading"
            >
              <div className="mb-6">
                <h2
                  id="home-recipe-explore-heading"
                  className="text-xl font-semibold text-gray-800 tracking-tight"
                >
                  레시피 둘러보기
                </h2>
                <p className="text-sm text-gray-600 mt-1.5">
                  다양한 레시피를 탐색해 보세요
                </p>
              </div>

              <div className="space-y-6">
                <RecipeSection
                  title="인기 레시피"
                  sort="popular"
                  limit={4}
                  category="all"
                  viewAllHref="/recipe/all?sort=popular"
                />

                <RecipeSection
                  title="최신 레시피"
                  sort="latest"
                  limit={4}
                  category="all"
                  viewAllHref="/recipe/all?sort=latest"
                />

                {/* 카테고리별 미리보기 */}
                <div className="pt-4">
                  <CategoryPreview />
                </div>
              </div>
            </div>
          </div>

          {/* 사이드바 (1열) */}
          <div className="lg:col-span-1">
            <IngredientPrice initialData={priceInitialData} initialError={priceInitialError} />
          </div>
        </div>
      </main>
    </div>
  );
}
