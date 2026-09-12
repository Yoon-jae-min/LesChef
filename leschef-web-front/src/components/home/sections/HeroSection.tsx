/**
 * 히어로 섹션 — 시트러스 그린 톤
 * 레시피 검색 + CTA (기능 유지)
 */

"use client";

import Link from "next/link";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/recipe/search/SearchBar";

export default function HeroSection() {
  const router = useRouter();

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
    <section
      className="relative bg-gradient-to-br from-lime-50 via-yellow-50 to-green-50 py-16 md:py-24 overflow-hidden"
      aria-label="LesChef 소개"
    >
      {/* 시트러스 장식 (장식용) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full bg-yellow-200/50 blur-2xl" />
        <div className="absolute -bottom-10 -right-6 w-48 h-48 rounded-full bg-lime-200/60 blur-2xl" />
        <div className="absolute top-16 right-16 w-24 h-24 rounded-full border-[10px] border-lime-300/40" />
        <div className="absolute bottom-20 left-20 w-16 h-16 rounded-full border-[8px] border-yellow-300/50" />
        <div className="absolute top-28 left-1/3 w-3 h-3 bg-lime-400/70 rounded-full animate-float" />
        <div className="absolute bottom-28 right-1/3 w-4 h-4 bg-yellow-400/60 rounded-full animate-float [animation-delay:1s]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            내 식재료를
            <br />
            <span className="text-green-600">스마트하게</span> 관리하세요
          </h1>

          <p className="text-lg md:text-xl text-gray-700 mb-8">
            유통기한 알림으로 낭비를 줄이고,
            <br className="hidden md:block" />
            검색으로 레시피를 찾아보세요
          </p>

          <div className="mb-8">
            <SearchBar className="max-w-2xl mx-auto" onSearch={handleHeroRecipeSearch} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/myPage/storage"
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-2xl shadow-[4px_4px_0_rgba(22,163,74,0.25)] hover:bg-green-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
            >
              식재료 관리하기
            </Link>
            <Link
              href="/recipe/all"
              className="px-8 py-3 bg-white text-green-700 font-semibold rounded-2xl border-2 border-green-600 hover:bg-green-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
            >
              레시피 둘러보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
