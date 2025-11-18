"use client";

import Link from "next/link";

const FAVORITE_RECIPES = Array.from({ length: 12 }).map((_, idx) => ({
  id: idx + 1,
  title: `favorite ${idx + 1}`,
  emoji: idx % 2 === 0 ? "🍲" : "🥗",
  highlight: idx % 2 === 0 ? "from-orange-100 to-rose-100" : "from-teal-100 to-emerald-100",
  tags: ["favorites", "레시피"],
}));

export default function FavoritesCategoryPage() {
  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {FAVORITE_RECIPES.map((card) => (
        <Link
          key={card.id}
          href="/recipe/detail"
          className="group flex flex-col rounded-[32px] border border-gray-200 bg-white p-5 shadow-[6px_6px_0_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label={`${card.title} 상세로 이동`}
        >
          <div className="relative overflow-hidden rounded-[24px] border border-gray-200 bg-gray-50">
            <div className="aspect-[5/3] w-full bg-gradient-to-br from-white to-gray-100">
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-gray-400">
                <span className="text-3xl">📷</span>
                <span>레시피 이미지</span>
              </div>
            </div>
          </div>

          <div
            className={`relative mt-4 flex items-center justify-between rounded-[24px] border border-gray-200 bg-gradient-to-br ${card.highlight} px-5 py-6`}
          >
            <span className="text-4xl">{card.emoji}</span>
            <div className="text-right text-black">
              <p className="text-xs uppercase tracking-[0.4em] text-gray-600">Favorites</p>
              <p className="text-3xl font-semibold">찜한 레시피</p>
              <p className="text-xs text-gray-700">나만의 저장 레시피</p>
            </div>
            <div className="absolute inset-0 rounded-[24px] border border-gray-200/10" />
          </div>

          <h3 className="mt-3 text-xl font-semibold text-gray-900">{card.title}</h3>

          <div className="mt-2 flex flex-wrap gap-2">
            {card.tags.map((tag) => (
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
      ))}
    </section>
  );
}
