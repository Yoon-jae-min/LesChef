/**
 * 카테고리별 레시피 미리보기
 * - default: 기존 카드형 (다른 페이지에서 재사용 가능)
 * - chips: 홈 시안용 한식/일식/중식/양식 칩
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

interface CategoryPreviewProps {
  variant?: "default" | "chips";
}

export default function CategoryPreview({ variant = "default" }: CategoryPreviewProps) {
  const sectionTitleId = useId();

  if (variant === "chips") {
    return (
      <nav aria-label="레시피 카테고리" className="flex flex-wrap gap-2 pt-1">
        {CATEGORIES.map((category) => (
          <Link
            key={category.key}
            href={category.href}
            className="rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-green-400 hover:bg-green-50 hover:text-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            {category.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <section className="bg-gray-50 py-12" aria-labelledby={sectionTitleId}>
      <div className="mx-auto max-w-7xl px-6">
        <h2 id={sectionTitleId} className="mb-8 text-center text-3xl font-bold text-gray-900">
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
      className="rounded-2xl border border-lime-100 bg-white p-6 shadow-sm transition-shadow hover:border-green-200 hover:shadow-md"
      aria-labelledby={cardTitleId}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 id={cardTitleId} className="text-xl font-bold text-gray-900">
          {categoryLabel}
        </h3>
        <Link
          href={href}
          className="rounded-lg text-sm font-medium text-green-600 transition-colors hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          aria-label={`${categoryLabel} 레시피 더보기`}
        >
          더보기<span aria-hidden> →</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-500">레시피가 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {recipes.map((recipe) => (
            <Link
              key={recipe._id || recipe.recipeName}
              href={recipe._id ? `/recipe/detail?id=${recipe._id}` : "/recipe"}
              className="block rounded-xl border border-gray-200 p-3 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              aria-label={
                recipe.recipeName
                  ? `${recipe.recipeName}${recipe.cookTime ? `, 조리 ${recipe.cookTime}분` : ""} · 상세 보기`
                  : "레시피 상세"
              }
            >
              <p className="truncate text-sm font-medium text-gray-900">{recipe.recipeName}</p>
              {recipe.cookTime && <p className="mt-1 text-xs text-gray-500">{recipe.cookTime}분</p>}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
