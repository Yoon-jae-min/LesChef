/**
 * 카테고리별 레시피 미리보기 컴포넌트
 */

"use client";

import Link from "next/link";
import { useId } from "react";
import useSWR from "swr";
import { fetchRecipeList, type RecipeListResponse } from "@/utils/api/recipeApi";
import { TIMING } from "@/constants/system/timing";
import { RECIPE_CATEGORY_TO_API } from "@/constants/navigation/categories";

const CATEGORIES = [
  { key: "korean", label: "한식", href: "/recipe/korean" },
  { key: "japanese", label: "일식", href: "/recipe/japanese" },
  { key: "chinese", label: "중식", href: "/recipe/chinese" },
  { key: "western", label: "양식", href: "/recipe/western" },
] as const;

export default function CategoryPreview() {
  const sectionTitleId = useId();
  return (
    <section className="py-12 bg-gray-50" aria-labelledby={sectionTitleId}>
      <div className="max-w-7xl mx-auto px-6">
        <h2 id={sectionTitleId} className="text-3xl font-bold text-gray-900 mb-8 text-center">
          카테고리별 레시피
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.key}
              categoryKey={category.key}
              categoryLabel={category.label}
              href={category.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface CategoryCardProps {
  categoryKey: string;
  categoryLabel: string;
  href: string;
}

function CategoryCard({ categoryKey, categoryLabel, href }: CategoryCardProps) {
  const cardTitleId = useId();
  const apiCategory = RECIPE_CATEGORY_TO_API[categoryKey] || categoryKey;
  const { data, isLoading } = useSWR<RecipeListResponse>(
    [`category-preview-${categoryKey}`, apiCategory],
    () =>
      fetchRecipeList({
        category: apiCategory as "korean" | "japanese" | "chinese" | "western" | "other",
        limit: 3,
      }),
    {
      dedupingInterval: TIMING.FIVE_MINUTES,
      revalidateOnFocus: false,
    }
  );

  const recipes = data?.list || [];

  return (
    <article
      className="bg-white rounded-[32px] border border-gray-200 shadow-[6px_6px_0_rgba(0,0,0,0.05)] p-6 hover:shadow-[8px_8px_0_rgba(0,0,0,0.05)] transition-shadow"
      aria-labelledby={cardTitleId}
    >
      {/* 카테고리 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 id={cardTitleId} className="text-xl font-bold text-gray-900">
          {categoryLabel}
        </h3>
        <Link
          href={href}
          className="text-sm text-orange-600 font-medium hover:text-orange-700 transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          aria-label={`${categoryLabel} 레시피 더보기`}
        >
          더보기<span aria-hidden> →</span>
        </Link>
      </div>

      {/* 레시피 미리보기 */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-8 text-sm text-gray-500">레시피가 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {recipes.map((recipe) => (
            <Link
              key={recipe._id || recipe.recipeName}
              href={recipe._id ? `/recipe/detail?id=${recipe._id}` : "/recipe"}
              className="block p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              aria-label={
                recipe.recipeName
                  ? `${recipe.recipeName}${recipe.cookTime ? `, 조리 ${recipe.cookTime}분` : ""} · 상세 보기`
                  : "레시피 상세"
              }
            >
              <p className="text-sm font-medium text-gray-900 truncate">{recipe.recipeName}</p>
              {recipe.cookTime && <p className="text-xs text-gray-500 mt-1">{recipe.cookTime}분</p>}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
