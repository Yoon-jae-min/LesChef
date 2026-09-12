/**
 * 히어로 섹션 — 시트러스 메인 시안
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
      className="relative overflow-hidden bg-[#FFF9E8] py-14 md:py-20"
      aria-label="LesChef 소개"
    >
      {/* 레몬/라임 수채화 느낌 장식 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <svg
          className="absolute -left-6 top-8 h-44 w-44 opacity-80 md:h-56 md:w-56"
          viewBox="0 0 200 200"
          fill="none"
        >
          <circle cx="100" cy="100" r="70" fill="#F6E27A" fillOpacity="0.55" />
          <circle cx="100" cy="100" r="48" fill="#FFF8C9" fillOpacity="0.9" />
          <path
            d="M100 52 L108 100 L100 148 L92 100 Z M52 100 L100 108 L148 100 L100 92 Z"
            fill="#E8C84A"
            fillOpacity="0.35"
          />
        </svg>
        <svg
          className="absolute -right-4 bottom-4 h-40 w-40 opacity-80 md:h-52 md:w-52"
          viewBox="0 0 200 200"
          fill="none"
        >
          <circle cx="100" cy="100" r="68" fill="#B7E36A" fillOpacity="0.5" />
          <circle cx="100" cy="100" r="46" fill="#EAF8C8" fillOpacity="0.95" />
          <path
            d="M100 54 L107 100 L100 146 L93 100 Z M54 100 L100 107 L146 100 L100 93 Z"
            fill="#7BC24A"
            fillOpacity="0.3"
          />
        </svg>
        <svg
          className="absolute right-24 top-10 hidden h-28 w-28 opacity-70 md:block"
          viewBox="0 0 200 200"
          fill="none"
        >
          <circle cx="100" cy="100" r="55" fill="#DFF59A" fillOpacity="0.55" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-[#1B5E20] md:text-5xl lg:text-[3.15rem] lg:leading-[1.15]">
            내 식재료를{" "}
            <span className="text-green-600">스마트하게</span> 관리하세요
          </h1>

          <p className="mb-8 text-base text-gray-600 md:text-lg">
            유통기한 알림과 스마트한 검색으로 신선함을 유지하세요.
          </p>

          <div className="mb-8">
            <SearchBar
              className="mx-auto max-w-2xl"
              variant="hero"
              onSearch={handleHeroRecipeSearch}
            />
          </div>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/myPage/storage"
              className="inline-flex min-w-[180px] items-center justify-center rounded-2xl bg-green-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
            >
              식재료 관리하기
            </Link>
            <Link
              href="/recipe/all"
              className="inline-flex min-w-[180px] items-center justify-center rounded-2xl bg-green-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
            >
              레시피 둘러보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
