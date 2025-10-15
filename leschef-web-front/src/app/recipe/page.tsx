"use client";

import Top from "@/components/common/top";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const CUISINE_TABS = ["한식", "일식", "중식", "양식", "기타"] as const;
const CUISINE_TO_SUBFILTERS: Record<(typeof CUISINE_TABS)[number], readonly string[]> = {
  한식: ["전체", "국, 찌개", "밥, 면", "반찬", "기타"],
  일식: ["전체", "국, 전골", "면", "밥", "기타"],
  중식: ["전체", "튀김, 찜", "면", "밥", "기타"],
  양식: ["전체", "스프, 스튜", "면", "빵", "기타"],
  기타: [],
} as const;

function RecipePage() {
  const [activeCuisine, setActiveCuisine] = useState<(typeof CUISINE_TABS)[number]>("한식");
  const [activeSub, setActiveSub] = useState<string>("전체");

  const placeholderCards = Array.from({ length: 15 }).map((_, idx) => ({ id: idx + 1 }));
  const subFiltersForActive = CUISINE_TO_SUBFILTERS[activeCuisine];

  return (
    <div className="min-h-screen bg-white">
      <Top />
      <main className="max-w-6xl mx-auto px-8 py-10">
        {/* 상단 카테고리 탭 */}
        <div className="flex items-center justify-center space-x-16 mb-6">
          {CUISINE_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveCuisine(tab);
                const next = CUISINE_TO_SUBFILTERS[tab];
                setActiveSub(next[0] ?? "");
              }}
              className={
                `text-2xl font-semibold transition-colors ${
                  activeCuisine === tab ? "text-black" : "text-gray-400 hover:text-gray-700"
                }`
              }
              aria-pressed={activeCuisine === tab}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 서브 필터 pill */}
        {subFiltersForActive.length > 0 ? (
          <div className="flex items-center justify-center space-x-4 mb-8">
            {subFiltersForActive.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveSub(filter)}
                className={
                  `px-4 py-2 rounded-full border transition-colors text-sm ${
                    activeSub === filter
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`
                }
                aria-pressed={activeSub === filter}
              >
                {filter}
              </button>
            ))}
          </div>
        ) : (
          // 기타 선택 시 리스트가 너무 확 올라오지 않도록 여백 유지
          <div className="h-4" />
        )}

        {/* 레시피 카드 그리드 */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-10">
          {placeholderCards.map((card) => (
            <Link
              key={card.id}
              href={`/recipe/${card.id}`}
              className="flex flex-col group focus:outline-none focus:ring-2 focus:ring-black rounded-sm"
              aria-label={`레시피 ${card.id} 상세로 이동`}
            >
              <div className="w-full aspect-square relative cursor-pointer">
                <Image
                  src="/common/noImage.png"
                  alt="이미지 없음"
                  fill
                  className="object-contain transition-transform group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  priority={card.id <= 5}
                />
              </div>
              <div className="mt-2 text-sm text-gray-800 text-center">example</div>
              <div className="mt-1 flex items-center justify-between px-1 text-[11px] text-gray-400">
                <div className="flex items-center space-x-1">
                  <span className="inline-block w-3 h-3 rounded-full border border-gray-300" />
                  <span>정보</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="inline-block w-3 h-3 rounded-full border border-gray-300" />
                  <span>time</span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}

export default RecipePage;


