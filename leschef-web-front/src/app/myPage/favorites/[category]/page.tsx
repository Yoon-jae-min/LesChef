"use client";

// 동적 렌더링 강제 (useSearchParams 이슈 방지)
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { fetchWishRecipeList, type WishRecipeListResponse } from "@/utils/api/recipeApi";

export default function FavoritesCategoryPage() {
  // 찜한 레시피 목록 가져오기 - SWR 캐싱 적용
  // 전역 설정 사용 (revalidateOnFocus: true, revalidateOnReconnect: true, dedupingInterval: 60000)
  const {
    data,
    error,
    isLoading: loading,
  } = useSWR<WishRecipeListResponse>("/wish-recipes", fetchWishRecipeList);

  const recipes = data?.wishList || [];

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {loading && (
        <div className="col-span-full flex items-center justify-center py-12 text-sm text-gray-500">
          찜한 레시피를 불러오는 중입니다...
        </div>
      )}
      {error && !loading && (
        <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error instanceof Error ? error.message : "찜한 레시피를 불러오지 못했습니다."}
        </div>
      )}
      {!loading && !error && recipes.length === 0 && (
        <div className="col-span-full flex items-center justify-center py-12 text-sm text-gray-500">
          찜한 레시피가 없습니다.
        </div>
      )}

      {!loading &&
        !error &&
        recipes.map((card) => (
          <Link
            key={card._id}
            href={card._id ? `/recipe/detail?id=${card._id}` : "/recipe"}
            className="group flex flex-col rounded-[32px] border border-gray-200 bg-white p-5 shadow-[6px_6px_0_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label={`${card.recipeName} 상세로 이동`}
          >
            <div className="relative overflow-hidden rounded-[24px] border border-gray-200 bg-gray-50">
              <div className="aspect-[5/3] w-full relative bg-gradient-to-br from-white to-gray-100">
                {card.recipeImg ? (
                  <Image
                    src={card.recipeImg}
                    alt={card.recipeName}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-gray-400">
                    <span className="text-3xl">📷</span>
                    <span>레시피 이미지</span>
                  </div>
                )}
              </div>
            </div>

            <div className="relative mt-4 flex items-center justify-between rounded-[24px] border border-gray-200 bg-gradient-to-br from-gray-50 to-white px-5 py-6">
              <span className="text-4xl">❤️</span>
              <div className="text-right text-black">
                <p className="text-xs uppercase tracking-[0.4em] text-gray-600">Favorites</p>
                <p className="text-3xl font-semibold">찜한 레시피</p>
                <p className="text-xs text-gray-700">
                  {card.subCategory || card.majorCategory || "나만의 저장 레시피"}
                </p>
              </div>
              <div className="absolute inset-0 rounded-[24px] border border-gray-200/10" />
            </div>

            <h3 className="mt-3 text-xl font-semibold text-gray-900">{card.recipeName}</h3>

            <div className="mt-2 flex flex-wrap gap-2">
              {(card.subCategory ? [card.subCategory] : [card.majorCategory || "레시피"]).map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600"
                  >
                    #{tag}
                  </span>
                )
              )}
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
