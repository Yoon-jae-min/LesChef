"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchWishRecipeList, type WishRecipeListResponse } from "@/utils/recipeApi";

export default function FavoritesCategoryPage() {
  const [recipes, setRecipes] = useState<WishRecipeListResponse["wishList"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWishRecipeList();
        setRecipes(data.wishList || []);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "찜한 레시피를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {loading && (
        <div className="col-span-full flex items-center justify-center py-12 text-sm text-gray-500">
          찜한 레시피를 불러오는 중입니다...
        </div>
      )}
      {error && !loading && (
        <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {!loading && !error && recipes.length === 0 && (
        <div className="col-span-full flex items-center justify-center py-12 text-sm text-gray-500">
          찜한 레시피가 없습니다.
        </div>
      )}

      {!loading && !error && recipes.map((card) => (
        <Link
          key={card._id}
          href={`/recipe/detail?id=${card._id}&recipeName=${encodeURIComponent(card.recipeName)}`}
          className="group flex flex-col rounded-[32px] border border-gray-200 bg-white p-5 shadow-[6px_6px_0_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label={`${card.recipeName} 상세로 이동`}
        >
          <div className="relative overflow-hidden rounded-[24px] border border-gray-200 bg-gray-50">
            <div className="aspect-[5/3] w-full bg-gradient-to-br from-white to-gray-100">
              {card.recipeImg ? (
                <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${card.recipeImg})` }} />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-gray-400">
                  <span className="text-3xl">📷</span>
                  <span>레시피 이미지</span>
                </div>
              )}
            </div>
          </div>

          <div
            className="relative mt-4 flex items-center justify-between rounded-[24px] border border-gray-200 bg-gradient-to-br from-gray-50 to-white px-5 py-6"
          >
            <span className="text-4xl">❤️</span>
            <div className="text-right text-black">
              <p className="text-xs uppercase tracking-[0.4em] text-gray-600">Favorites</p>
              <p className="text-3xl font-semibold">찜한 레시피</p>
              <p className="text-xs text-gray-700">{card.subCategory || card.majorCategory || "나만의 저장 레시피"}</p>
            </div>
            <div className="absolute inset-0 rounded-[24px] border border-gray-200/10" />
          </div>

          <h3 className="mt-3 text-xl font-semibold text-gray-900">{card.recipeName}</h3>

          <div className="mt-2 flex flex-wrap gap-2">
            {(card.subCategory ? [card.subCategory] : [card.majorCategory || "레시피"]).map((tag) => (
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
