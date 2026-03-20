/**
 * 레시피 섹션 컴포넌트
 * 인기 레시피, 최신 레시피 등을 표시
 */

"use client";

import Link from "next/link";
import useSWR from "swr";
import RecipeCard from "@/components/recipe/card/RecipeCard";
import {
  fetchRecipeList,
  type RecipeListResponse,
  type RecipeSortOption,
} from "@/utils/api/recipeApi";
import { TIMING } from "@/constants/system/timing";
import ErrorMessage from "@/components/common/ui/ErrorMessage";

interface RecipeSectionProps {
  title: string;
  sort: RecipeSortOption;
  limit?: number;
  category?: "all" | "korean" | "japanese" | "chinese" | "western" | "other";
  showViewAll?: boolean;
  viewAllHref?: string;
}

export default function RecipeSection({
  title,
  sort,
  limit = 8,
  category = "all",
  showViewAll = true,
  viewAllHref,
}: RecipeSectionProps) {
  const { data, error, isLoading } = useSWR<RecipeListResponse>(
    [`recipe-section-${sort}-${category}`, category, sort, limit],
    () => fetchRecipeList({ category, sort, limit }),
    {
      dedupingInterval: TIMING.FIVE_MINUTES,
      revalidateOnFocus: false,
    }
  );

  const recipes = data?.list || [];

  if (error) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{title}</h2>
          <ErrorMessage error={error} showDetails={false} showAction={false} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* 섹션 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          {showViewAll && recipes.length > 0 && (
            <Link
              href={viewAllHref || `/recipe/${category}?sort=${sort}`}
              className="text-orange-600 font-medium hover:text-orange-700 transition-colors flex items-center gap-1"
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

        {/* 레시피 목록 */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: limit }).map((_, i) => (
              <div
                key={i}
                className="rounded-[32px] border border-gray-200 bg-gray-100 animate-pulse h-64"
              />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">레시피가 없습니다.</div>
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
