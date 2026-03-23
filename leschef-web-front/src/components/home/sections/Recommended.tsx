/**
 * 보유 재료로 만들 수 있는 레시피 추천 섹션
 * 사용자가 보유한 재료를 기반으로 레시피를 추천
 */

"use client";

import Link from "next/link";
import { useMemo } from "react";
import useSWR from "swr";
import { fetchFoodsList, type FoodsListResponse, type StoragePlace } from "@/utils/api/foods";
import { fetchRecipeList, type RecipeListResponse } from "@/utils/api/recipeApi";
import { TIMING } from "@/constants/system/timing";
import ErrorMessage from "@/components/common/ui/ErrorMessage";
import RecipeCard from "@/components/recipe/card/RecipeCard";

interface RecommendedProps {
  isLoggedIn?: boolean;
}

export default function Recommended({ isLoggedIn = false }: RecommendedProps) {
  // 보유 재료 목록 가져오기 (로그인한 경우에만)
  const {
    data: foodsData,
    error: foodsError,
    isLoading: foodsLoading,
  } = useSWR<FoodsListResponse>(isLoggedIn ? "/foods/place" : null, () => fetchFoodsList(), {
    dedupingInterval: TIMING.ONE_MINUTE,
    revalidateOnFocus: false,
  });

  /** 전체 항목 수·이름 없음 개수 (맞춤 추천은 이름이 있는 항목만 키워드에 사용) */
  const inventoryStats = useMemo(() => {
    let total = 0;
    let unnamed = 0;
    if (!foodsData?.sectionList?.length) return { total: 0, unnamed: 0 };
    foodsData.sectionList.forEach((place: StoragePlace) => {
      place.foodList?.forEach((food) => {
        total += 1;
        if (!food.name?.trim()) unnamed += 1;
      });
    });
    return { total, unnamed };
  }, [foodsData?.sectionList]);

  // 보유 재료 이름 목록 (비어 있지 않은 이름만 — 이미지만 있는 항목은 키워드 추천 제외)
  const ownedIngredients = useMemo(() => {
    if (!foodsData?.sectionList || foodsData.sectionList.length === 0) return [];

    const ingredients = new Set<string>();
    foodsData.sectionList.forEach((place: StoragePlace) => {
      place.foodList?.forEach((food) => {
        const normalized = food.name?.trim().toLowerCase() ?? "";
        if (normalized.length > 0) {
          ingredients.add(normalized);
        }
      });
    });

    return Array.from(ingredients);
  }, [foodsData?.sectionList]);

  // 보유 재료가 있을 때만 레시피 검색
  const shouldFetchRecipes = ownedIngredients.length > 0;

  // 레시피 목록 가져오기 (보유 재료 기반 검색)
  // 보유 재료 이름을 키워드로 사용하여 검색
  const searchKeywords = useMemo(() => {
    if (ownedIngredients.length === 0) return "";
    // 상위 3개 재료만 사용하여 검색 (너무 많은 키워드는 성능 저하)
    return ownedIngredients.slice(0, 3).join(" ");
  }, [ownedIngredients]);

  const {
    data: recipesData,
    error: recipesError,
    isLoading: recipesLoading,
  } = useSWR<RecipeListResponse>(
    shouldFetchRecipes ? ["recommended-recipes", searchKeywords] : null,
    async () => {
      // 보유 재료 이름을 키워드로 검색
      // API의 keyword 파라미터를 사용하여 재료명으로 검색
      const searchResults = await fetchRecipeList({
        category: "all",
        sort: "popular",
        limit: 12,
        keyword: searchKeywords,
      });

      return {
        ...searchResults,
        list: searchResults.list.slice(0, 6), // 최대 6개만 표시
      };
    },
    {
      dedupingInterval: TIMING.FIVE_MINUTES,
      revalidateOnFocus: false,
    }
  );

  const recipes = recipesData?.list || [];
  const isLoading = foodsLoading || recipesLoading;
  const error = foodsError || recipesError;

  // 로그인하지 않은 경우
  if (!isLoggedIn) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">보유 재료로 만들 수 있는 레시피</h2>
              <p className="text-sm text-gray-500 mt-1">
                보유한 재료를 등록하면 맞춤 레시피를 추천해드립니다.
              </p>
            </div>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-600 mb-4">
              로그인하시면 보유한 재료로 만들 수 있는 레시피를 추천해드려요!
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-2xl hover:bg-orange-700 transition-colors"
            >
              로그인하고 레시피 추천받기
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // 보관 항목이 하나도 없을 때
  if (!foodsLoading && inventoryStats.total === 0) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">보유 재료로 만들 수 있는 레시피</h2>
              <p className="text-sm text-gray-500 mt-1">
                보유한 재료를 등록하면 맞춤 레시피를 추천해드립니다.
              </p>
            </div>
          </div>
          <div className="rounded-3xl border border-dashed border-gray-300 bg-gradient-to-br from-orange-50 to-yellow-50 p-12 text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <p className="text-gray-600 mb-4 font-medium">아직 등록된 식재료가 없어요</p>
            <Link
              href="/myPage/storage"
              className="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-2xl hover:bg-orange-700 transition-colors"
            >
              식재료 등록하기
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // 항목은 있으나 이름이 있는 재료가 없을 때 (이미지만 등록된 경우 등)
  if (!foodsLoading && inventoryStats.total > 0 && ownedIngredients.length === 0) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">보유 재료로 만들 수 있는 레시피</h2>
              <p className="text-sm text-gray-500 mt-1">
                맞춤 추천은 <span className="font-medium text-gray-700">이름이 있는 재료</span>를
                기준으로 검색합니다.
              </p>
            </div>
          </div>
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
            <p className="text-gray-800 mb-2 font-medium">
              이름이 있는 재료가 없어 레시피를 찾아드리기 어려워요.
            </p>
            <p className="text-sm text-amber-900/90 mb-6">
              보관함에서 재료에{" "}
              <span className="font-semibold">이름을 입력</span>하면 맞춤 추천에 반영돼요. (나중에
              자동 이름 기능을 붙일 수도 있어요.)
            </p>
            <Link
              href="/myPage/storage"
              className="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-2xl hover:bg-orange-700 transition-colors"
            >
              보관함에서 이름 입력하기
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">보유 재료로 만들 수 있는 레시피</h2>
          <ErrorMessage error={error} showDetails={false} showAction={false} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                맞춤 추천
              </span>
              <h2 className="text-2xl font-bold text-gray-900">보유 재료로 만들 수 있는 레시피</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              이름이 있는 재료 {ownedIngredients.length}가지로 검색해 추천했어요.
            </p>
          </div>
          {recipes.length > 0 && (
            <Link
              href={`/recipe/all?ingredients=${encodeURIComponent(ownedIngredients.join(","))}`}
              className="text-sm text-orange-600 font-medium hover:text-orange-700 transition-colors flex items-center gap-1"
            >
              전체보기
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          )}
        </div>

        {inventoryStats.unnamed > 0 && (
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            <span className="font-medium">이름이 없는 재료 {inventoryStats.unnamed}개</span>는 검색
            키워드에 포함되지 않아요.{" "}
            <Link href="/myPage/storage" className="font-semibold text-orange-700 underline-offset-2 hover:underline">
              보관함에서 이름을 입력
            </Link>
            하면 맞춤 추천에 반영돼요.
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[32px] border border-gray-200 bg-gray-100 animate-pulse h-64"
              />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-gray-600">
              보유한 재료로 만들 수 있는 레시피를 찾지 못했습니다.
              <br />
              다른 재료를 추가해보세요!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id || recipe.recipeName} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
