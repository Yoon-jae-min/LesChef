/**
 * 히어로 섹션 컴포넌트
 * 메인 페이지 상단의 서비스 소개 및 검색바
 */

"use client";

import Link from "next/link";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/recipe/search/SearchBar";

export default function HeroSection() {
  const router = useRouter();

  /** 메인 히어로 검색 → 레시피 목록으로 이동 (목록에서 keyword 쿼리로 조회) */
  const handleHeroRecipeSearch = useCallback(
    (keyword: string) => {
      const params = new URLSearchParams();
      const k = keyword.trim();
      if (k) params.set("keyword", k);
      const qs = params.toString();
      router.push(qs ? `/recipe/all?${qs}` : "/recipe/all");
    },
    [router]
  );

  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 py-16 md:py-24 overflow-hidden">
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-orange-200 rounded-full animate-float [animation-delay:0s] opacity-60"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-yellow-200 rounded-full animate-float [animation-delay:1s] opacity-60"></div>
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-red-200 rounded-full animate-float [animation-delay:2s] opacity-60"></div>
        <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-orange-200 rounded-full animate-float [animation-delay:0.5s] opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* 메인 타이틀 */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            내 식재료를
            <br />
            <span className="text-orange-600">스마트하게</span> 관리하세요
          </h1>

          {/* 서브 타이틀 */}
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            유통기한 알림으로 낭비를 줄이고,
            <br className="hidden md:block" />
            보유 재료로 만들 수 있는 레시피를 찾아보세요
          </p>

          {/* 검색바 */}
          <div className="mb-8">
            <SearchBar className="max-w-2xl mx-auto" onSearch={handleHeroRecipeSearch} />
          </div>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/myPage/storage"
              className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              식재료 관리하기
            </Link>
            <Link
              href="/recipe/all"
              className="px-8 py-3 bg-white text-orange-600 font-semibold rounded-2xl border-2 border-orange-600 hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              레시피 둘러보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
