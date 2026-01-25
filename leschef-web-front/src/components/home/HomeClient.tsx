/**
 * 메인 페이지 클라이언트 컴포넌트
 * 식재료 관리 중심의 대시보드 구성
 */

"use client";

import Top from "@/components/common/navigation/Top";
import HeroSection from "./sections/HeroSection";
import ExpiryAlerts from "./sections/ExpiryAlerts";
import FoodInventory from "./sections/FoodInventory";
import Recommended from "./sections/Recommended";
import RecipeSection from "./sections/RecipeSection";
import CategoryPreview from "./sections/CategoryPreview";
import IngredientPrice from "./sidebar/IngredientPrice";
import { useExpiryAlerts } from "@/hooks/useExpiryAlerts";
import type { IngredientPriceResponse } from "@/utils/api/ingredientPrice";
import useSWR from "swr";
import { checkAuth } from "@/utils/api/auth";

interface HomeClientProps {
  priceInitialData?: IngredientPriceResponse | null;
  priceInitialError?: string | null;
}

export default function HomeClient({
  priceInitialData,
  priceInitialError,
}: HomeClientProps) {
  // 로그인 상태 확인 (isLoading 추가)
  const { data: authData, isLoading: isAuthLoading } = useSWR("auth_status", checkAuth);
  // 로딩 중이 아니고 데이터가 있으며 loggedIn이 true일 때만 실제 로그인으로 간주
  const isLoggedIn = !isAuthLoading && authData?.loggedIn === true;

  // 유통기한 알림 모니터링 (백그라운드에서 실행 - 로그인 시에만)
  useExpiryAlerts(isLoggedIn);

  return (
    <div className="min-h-screen bg-white">
      <Top />
      
      {/* 히어로 섹션 */}
      <HeroSection />

      {/* 메인 콘텐츠 영역 */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 콘텐츠 (3열) */}
          <div className="lg:col-span-3 space-y-8">
            {/* 유통기한 임박 알림 섹션 */}
            <ExpiryAlerts isLoggedIn={isLoggedIn} />

            {/* 보유 재료 요약 섹션 */}
            <FoodInventory isLoggedIn={isLoggedIn} />

            {/* 보유 재료로 만들 수 있는 레시피 (강조) */}
            <Recommended isLoggedIn={isLoggedIn} />

            {/* 레시피 섹션 (서브 - 더 작게) */}
            <div className="pt-12 border-t-2 border-gray-300">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-500 uppercase tracking-wide">레시피 둘러보기</h2>
                <p className="text-sm text-gray-400 mt-1">다양한 레시피를 탐색해보세요</p>
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
            <IngredientPrice
              initialData={priceInitialData}
              initialError={priceInitialError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
