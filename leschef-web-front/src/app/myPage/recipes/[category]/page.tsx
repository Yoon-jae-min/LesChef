"use client";

// 동적 렌더링 강제 (useSearchParams 이슈 방지)
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { useParams, useSearchParams } from "next/navigation";
import { fetchMyRecipeList, deleteRecipe, type MyRecipeListResponse } from "@/utils/api/recipeApi";
import {
  FAVORITES_SUB_CATEGORY_QUERY,
  favoritesMajorFromSlug,
  normalizeFavoritesSubSelection,
} from "@/constants/recipe/favoritesFilters";

function MyRecipesCategoryPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const slug = typeof params?.category === "string" ? params.category : "korean";
  const major = favoritesMajorFromSlug(slug);
  const subFromUrl = searchParams.get(FAVORITES_SUB_CATEGORY_QUERY);
  const activeSub = normalizeFavoritesSubSelection(major, subFromUrl);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    data,
    error,
    isLoading: loading,
    mutate,
  } = useSWR<MyRecipeListResponse>("/my-recipes", fetchMyRecipeList);

  const allList = data?.list ?? [];

  const recipes = useMemo(() => {
    return allList.filter((r) => {
      const maj = (r.majorCategory ?? "").trim();
      if (maj !== major) return false;
      if (activeSub === "전체") return true;
      const sub = (r.subCategory ?? "").trim();
      return sub === activeSub;
    });
  }, [allList, major, activeSub]);

  const hasAny = allList.length > 0;
  const filterEmpty = hasAny && recipes.length === 0;

  const handleEditClick = (e: React.MouseEvent, recipeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined") {
      window.location.href = `/myPage/recipes/edit?id=${recipeId}`;
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, recipeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteTargetId(recipeId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;

    try {
      const response = await deleteRecipe(deleteTargetId);
      if (response.ok) {
        const result = await response.json();
        if (result.text === "success") {
          await mutate();
          setShowDeleteConfirm(false);
          setDeleteTargetId(null);
        } else {
          throw new Error("레시피 삭제에 실패했습니다.");
        }
      } else {
        const text = await response.text();
        throw new Error(text || "레시피 삭제에 실패했습니다.");
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("레시피 삭제 실패:", err);
      }
      alert(err instanceof Error ? err.message : "레시피 삭제에 실패했습니다.");
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
  };

  return (
    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {loading && (
        <div
          className="col-span-full flex flex-col items-center justify-center gap-3 rounded-[28px] border border-stone-200/90 bg-white/80 py-14 shadow-sm ring-1 ring-stone-900/[0.03]"
          role="status"
          aria-live="polite"
        >
          <span className="h-9 w-9 animate-spin rounded-full border-2 border-stone-200 border-t-orange-500" />
          <p className="text-sm text-stone-600">나의 레시피를 불러오는 중입니다…</p>
        </div>
      )}
      {error && !loading && (
        <div className="col-span-full rounded-[20px] border border-red-200/90 bg-red-50/90 px-5 py-4 text-sm text-red-800 shadow-sm ring-1 ring-red-900/5">
          {error instanceof Error ? error.message : "나의 레시피를 불러오지 못했습니다."}
        </div>
      )}
      {!loading && !error && !hasAny && (
        <div className="col-span-full rounded-[28px] border border-dashed border-stone-300/90 bg-stone-50/60 py-14 text-center text-sm text-stone-600">
          작성한 레시피가 없습니다.
        </div>
      )}
      {!loading && !error && filterEmpty && (
        <div className="col-span-full rounded-[28px] border border-dashed border-stone-300/90 bg-stone-50/60 px-4 py-12 text-center text-sm text-stone-600">
          <p className="font-medium text-stone-800">
            이 카테고리{activeSub !== "전체" ? ` · ${activeSub}` : ""}에 해당하는 레시피가 없어요.
          </p>
          <p className="mt-2 text-xs text-stone-500">
            다른 요리 종류·하위 필터를 선택하거나 레시피를 작성해 보세요.
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
                🍳
              </span>
              <div className="text-right text-stone-900">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                  My Recipe
                </p>
                <p className="text-xl font-bold tracking-tight sm:text-2xl">작성 레시피</p>
                <p className="text-xs text-stone-600">
                  {card.subCategory || card.majorCategory || "나의 레시피"}
                </p>
              </div>
            </div>

            <h3 className="mt-3 text-lg font-semibold tracking-tight text-stone-900 group-hover:text-orange-900 sm:text-xl">
              {card.recipeName}
            </h3>

            <div className="mt-2 flex items-center justify-between text-xs text-stone-600">
              <div className="flex flex-wrap gap-2">
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
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                작성 완료
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => card._id && handleEditClick(e, card._id)}
                  className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  disabled={!card._id}
                >
                  편집
                </button>
                <button
                  type="button"
                  onClick={(e) => card._id && handleDeleteClick(e, card._id)}
                  disabled={!card._id}
                  className="rounded-xl border border-red-200/90 bg-white px-3 py-1.5 text-xs font-medium text-red-600 shadow-sm transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  삭제
                </button>
                <span className="text-[11px] text-stone-500">레시피 상세 보기</span>
              </div>
              <span className="text-[11px] font-semibold text-orange-600 transition group-hover:translate-x-0.5">
                →
              </span>
            </div>
          </Link>
        ))}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/45 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-[28px] border border-stone-200/90 bg-white p-8 shadow-xl shadow-stone-900/10 ring-1 ring-stone-900/[0.04]">
            <div className="mb-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-center text-2xl font-semibold text-stone-900">레시피 삭제</h3>
              <p className="mb-4 text-center text-sm text-stone-600">
                정말로 이 레시피를 삭제하시겠습니까?
              </p>
              <div className="mb-4 rounded-2xl border border-red-200/90 bg-red-50 p-4">
                <p className="mb-2 text-sm font-medium text-red-800">삭제 시 주의사항:</p>
                <ul className="list-inside list-disc space-y-1 text-xs text-red-700">
                  <li>레시피 정보가 영구적으로 삭제됩니다</li>
                  <li>업로드한 이미지 파일도 함께 삭제됩니다</li>
                  <li>삭제된 레시피는 복구할 수 없습니다</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDeleteCancel}
                className="flex-1 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => void handleDeleteConfirm()}
                className="flex-1 rounded-2xl border border-red-600 bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default function MyRecipesCategoryPage() {
  return <MyRecipesCategoryPageContent />;
}
