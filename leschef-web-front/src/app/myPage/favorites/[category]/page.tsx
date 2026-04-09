"use client";

// 동적 렌더링 강제 (useSearchParams 이슈 방지)
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import useSWR from "swr";
import { useParams, useSearchParams } from "next/navigation";
import { fetchWishRecipeList, type WishRecipeListResponse } from "@/utils/api/recipeApi";
import {
  FAVORITES_SUB_CATEGORY_QUERY,
  favoritesMajorFromSlug,
  normalizeFavoritesSubSelection,
} from "@/constants/recipe/favoritesFilters";

export default function FavoritesCategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const slug = typeof params?.category === "string" ? params.category : "korean";
  const major = favoritesMajorFromSlug(slug);
  const subFromUrl = searchParams.get(FAVORITES_SUB_CATEGORY_QUERY);
  const activeSub = normalizeFavoritesSubSelection(major, subFromUrl);

  const {
    data,
    error,
    isLoading: loading,
  } = useSWR<WishRecipeListResponse>("/wish-recipes", fetchWishRecipeList);

  const allWish = data?.wishList ?? [];

  const recipes = useMemo(() => {
    return allWish.filter((r) => {
      const maj = (r.majorCategory ?? "").trim();
      if (maj !== major) return false;
      if (activeSub === "전체") return true;
      const sub = (r.subCategory ?? "").trim();
      return sub === activeSub;
    });
  }, [allWish, major, activeSub]);

  const hasAnyWish = allWish.length > 0;
  const filterEmpty = hasAnyWish && recipes.length === 0;

  return (
    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {loading && (
        <div
          className="col-span-full flex flex-col items-center justify-center gap-3 rounded-[28px] border border-stone-200/90 bg-white/80 py-14 shadow-sm ring-1 ring-stone-900/[0.03]"
          role="status"
          aria-live="polite"
        >
          <span className="h-9 w-9 animate-spin rounded-full border-2 border-stone-200 border-t-orange-500" />
          <p className="text-sm text-stone-600">찜한 레시피를 불러오는 중입니다…</p>
        </div>
      )}
      {error && !loading && (
        <div className="col-span-full rounded-[20px] border border-red-200/90 bg-red-50/90 px-5 py-4 text-sm text-red-800 shadow-sm ring-1 ring-red-900/5">
          {error instanceof Error ? error.message : "찜한 레시피를 불러오지 못했습니다."}
        </div>
      )}
      {!loading && !error && !hasAnyWish && (
        <div className="col-span-full rounded-[28px] border border-dashed border-stone-300/90 bg-stone-50/60 py-14 text-center text-sm text-stone-600">
          찜한 레시피가 없습니다.
        </div>
      )}
      {!loading && !error && filterEmpty && (
        <div className="col-span-full rounded-[28px] border border-dashed border-stone-300/90 bg-stone-50/60 px-4 py-12 text-center text-sm text-stone-600">
          <p className="font-medium text-stone-800">
            이 카테고리{activeSub !== "전체" ? ` · ${activeSub}` : ""}에 해당하는 찜이 없어요.
          </p>
          <p className="mt-2 text-xs text-stone-500">
            다른 요리 종류·하위 필터를 선택하거나, 레시피 목록에서 찜을 추가해 보세요.
          </p>
        </div>
      )}

      {!loading &&
        !error &&
        recipes.map((card) => (
          <Link
            key={card._id}
            href={card._id ? `/recipe/detail?id=${card._id}` : "/recipe"}
            className="group flex flex-col rounded-[28px] border border-stone-200/90 bg-white/95 p-5 shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.03] transition hover:-translate-y-0.5 hover:border-stone-300/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            aria-label={`${card.recipeName} 상세로 이동`}
          >
            <div className="relative overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-50">
              <div className="relative aspect-[5/3] w-full bg-gradient-to-br from-stone-50 to-orange-50/30">
                {card.recipeImg ? (
                  <Image
                    src={card.recipeImg}
                    alt={card.recipeName}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-stone-400">
                    <span className="text-3xl">📷</span>
                    <span>레시피 이미지</span>
                  </div>
                )}
              </div>
            </div>

            <div className="relative mt-4 flex items-center justify-between rounded-2xl border border-stone-200/80 bg-gradient-to-br from-stone-50 via-white to-orange-50/40 px-4 py-5">
              <span className="text-3xl" aria-hidden>
                ❤️
              </span>
              <div className="text-right text-stone-900">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                  Favorites
                </p>
                <p className="text-xl font-bold tracking-tight sm:text-2xl">찜한 레시피</p>
                <p className="text-xs text-stone-600">
                  {card.subCategory || card.majorCategory || "나만의 저장 레시피"}
                </p>
              </div>
            </div>

            <h3 className="mt-3 text-lg font-semibold tracking-tight text-stone-900 group-hover:text-orange-900 sm:text-xl">
              {card.recipeName}
            </h3>

            <div className="mt-2 flex flex-wrap gap-2">
              {(card.subCategory ? [card.subCategory] : [card.majorCategory || "레시피"]).map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600"
                  >
                    #{tag}
                  </span>
                )
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4 text-[11px] text-stone-500">
              <span>레시피 상세 보기</span>
              <span className="font-semibold text-orange-600 transition group-hover:translate-x-0.5">
                →
              </span>
            </div>
          </Link>
        ))}
    </section>
  );
}
