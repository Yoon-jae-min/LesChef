/**
 * 메인 페이지 클라이언트 컴포넌트
 * 시트러스 히어로 + 좌(알림·요약) / 중(레시피) / 우(식품검색)
 */

"use client";

import Top from "@/components/common/navigation/Top";
import SiteFooter from "@/components/common/ui/SiteFooter";
import HeroSection from "./sections/HeroSection";
import ExpiryAlerts from "./sections/ExpiryAlerts";
import FoodInventory from "./sections/FoodInventory";
import HomeRecipeBrowse from "./sections/HomeRecipeBrowse";
import FoodSearch from "./sidebar/FoodSearch";
import { useExpiryAlerts } from "@/hooks/useExpiryAlerts";
import useSWR from "swr";
import { checkAuth } from "@/utils/api/auth";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { STORAGE_KEYS } from "@/constants/storage/storageKeys";

export default function HomeClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const userIdParam = searchParams.get("userId");
  const nameParam = searchParams.get("name");
  const nickNameParam = searchParams.get("nickName");
  const telParam = searchParams.get("tel");
  const isSnsCallback = !!userIdParam && !!nickNameParam;

  const { data: authData, isLoading: isAuthLoading } = useSWR("auth_status", checkAuth);
  const isLoggedIn = !isAuthLoading && authData?.loggedIn === true;

  useEffect(() => {
    if (isSnsCallback && userIdParam && nickNameParam) {
      try {
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

        if (typeof window !== "undefined") {
          window.location.href = "/";
        } else {
          router.replace("/");
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("카카오 로그인 후 처리 오류:", error);
        }
      }
    }
  }, [isSnsCallback, userIdParam, nameParam, nickNameParam, telParam, router]);

  // 유통기한 알림 모니터링 (로그인 시에만) — early return 전에 Hook 호출
  useExpiryAlerts(isLoggedIn && !isSnsCallback);

  if (isSnsCallback) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div
          className="flex flex-col items-center gap-3 text-sm text-gray-500"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"
            aria-hidden
          />
          <span>SNS 로그인 처리 중입니다...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-gray-900 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        본문으로 건너뛰기
      </a>
      <Top />

      <HeroSection />

      <main id="main-content" className="mx-auto max-w-7xl px-6 py-10 outline-none md:py-12" tabIndex={-1}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6 xl:gap-8">
          {/* 좌: 유통기한 알림 + 보유 재료 요약 */}
          <div className="space-y-6 lg:col-span-3">
            <ExpiryAlerts
              isLoggedIn={isLoggedIn}
              authLoading={isAuthLoading}
              embedded
            />
            <FoodInventory
              isLoggedIn={isLoggedIn}
              authLoading={isAuthLoading}
              embedded
            />
          </div>

          {/* 중: 레시피 둘러보기 */}
          <div className="lg:col-span-5 xl:col-span-6">
            <HomeRecipeBrowse />
          </div>

          {/* 우: 식품 검색 */}
          <div className="lg:col-span-4 xl:col-span-3">
            <FoodSearch />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
