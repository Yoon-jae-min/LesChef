"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type RecipeCard = {
  id: number;
  title: string;
  emoji: string;
  cookTime: string;
  level: string;
  matchPercent: number;
  missingCount: number;
  highlight: string;
  tags: string[];
  thumbnail?: string;
};

const SAMPLE_RECIPES: RecipeCard[] = [
  {
    id: 1,
    title: "두부 김치찌개",
    emoji: "🍲",
    cookTime: "25분",
    level: "초급",
    matchPercent: 92,
    missingCount: 0,
    highlight: "from-orange-100 to-rose-100",
    tags: ["돼지고기", "김치", "두부"],
    thumbnail: "/sample/boardPage-상세정보.png",
  },
  {
    id: 2,
    title: "참깨 두부 샐러드",
    emoji: "🥗",
    cookTime: "15분",
    level: "초급",
    matchPercent: 84,
    missingCount: 1,
    highlight: "from-emerald-100 to-teal-100",
    tags: ["두부", "채소", "참깨"],
    thumbnail: "/sample/boardPage-리스트.png",
  },
  {
    id: 3,
    title: "버터 감자구이",
    emoji: "🥔",
    cookTime: "30분",
    level: "중급",
    matchPercent: 78,
    missingCount: 1,
    highlight: "from-amber-100 to-yellow-100",
    tags: ["감자", "버터", "허브"],
  },
  {
    id: 4,
    title: "양파 비빔국수",
    emoji: "🍜",
    cookTime: "20분",
    level: "초급",
    matchPercent: 71,
    missingCount: 2,
    highlight: "from-red-100 to-orange-100",
    tags: ["양파", "비빔장", "면"],
  },
  {
    id: 5,
    title: "닭가슴살 볶음밥",
    emoji: "🍛",
    cookTime: "18분",
    level: "초급",
    matchPercent: 88,
    missingCount: 1,
    highlight: "from-lime-100 to-green-100",
    tags: ["닭가슴살", "밥", "채소"],
    thumbnail: "/sample/recipePage-리스트.png",
  },
  {
    id: 6,
    title: "감자 뇨끼",
    emoji: "🍽️",
    cookTime: "35분",
    level: "중급",
    matchPercent: 64,
    missingCount: 2,
    highlight: "from-slate-100 to-stone-100",
    tags: ["감자", "치즈", "허브"],
  },
  {
    id: 7,
    title: "두부 탕수",
    emoji: "🥢",
    cookTime: "28분",
    level: "중급",
    matchPercent: 81,
    missingCount: 1,
    highlight: "from-purple-100 to-pink-100",
    tags: ["두부", "탕수소스", "야채"],
  },
  {
    id: 8,
    title: "김치 감자전",
    emoji: "🥞",
    cookTime: "22분",
    level: "초급",
    matchPercent: 89,
    missingCount: 0,
    highlight: "from-rose-100 to-orange-100",
    tags: ["감자", "김치", "부침"],
  },
  {
    id: 9,
    title: "양파 코코넛 카레",
    emoji: "🍛",
    cookTime: "35분",
    level: "중급",
    matchPercent: 58,
    missingCount: 2,
    highlight: "from-yellow-100 to-orange-100",
    tags: ["양파", "카레", "코코넛"],
  },
  {
    id: 10,
    title: "냉동 딸기 요거트볼",
    emoji: "🍨",
    cookTime: "10분",
    level: "초급",
    matchPercent: 76,
    missingCount: 1,
    highlight: "from-pink-100 to-rose-100",
    tags: ["딸기", "요거트", "견과"],
  },
];

export default function CategoryPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn =
      typeof window !== "undefined" &&
      localStorage.getItem("leschef_is_logged_in") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {SAMPLE_RECIPES.map((recipe) => {
        const missingLabel =
          recipe.missingCount === 0
            ? "추가 재료 없이 가능"
            : `필요 재료 ${recipe.missingCount}개`;
        return (
          <Link
            key={recipe.id}
            href="/recipe/detail"
            className="group flex flex-col rounded-[32px] border border-gray-200 bg-white p-5 shadow-[6px_6px_0_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label={`${recipe.title} 상세로 이동`}
          >
            <div className="relative overflow-hidden rounded-[24px] border border-gray-200 bg-gray-50">
              <div className="aspect-[5/3] w-full bg-gradient-to-br from-white to-gray-100">
                {recipe.thumbnail ? (
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${recipe.thumbnail})` }}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-gray-400">
                    <span className="text-3xl">📷</span>
                    <span>레시피 이미지</span>
                  </div>
                )}
              </div>
            </div>

            {isLoggedIn ? (
              <div
                className={`relative mt-4 flex items-center justify-between rounded-[24px] border border-gray-200 bg-gradient-to-br ${recipe.highlight} px-5 py-6`}
              >
                <span className="text-4xl">{recipe.emoji}</span>
                <div className="text-right text-black">
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-600">Match</p>
                  <p className="text-3xl font-semibold">{recipe.matchPercent}%</p>
                  <p className="text-xs text-gray-700">{missingLabel}</p>
                </div>
                <div className="absolute inset-0 rounded-[24px] border border-gray-200/30" />
              </div>
            ) : (
              <div className="mt-4 rounded-[24px] border border-dashed border-gray-200 bg-gray-50 px-5 py-4 text-xs text-gray-500">
                로그인하면 내 재료와의 매칭 정도를 확인할 수 있어요.
              </div>
            )}

            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-600">
                {recipe.level}
              </span>
              <span className="font-medium text-gray-800">{recipe.cookTime}</span>
            </div>

            <h3 className="mt-3 text-xl font-semibold text-gray-900">{recipe.title}</h3>

            <div className="mt-2 flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-gray-500">
              <span>레시피 상세 보기</span>
              <span className="font-semibold text-gray-800">→</span>
            </div>
          </Link>
        );
      })}
    </section>
  );
}
