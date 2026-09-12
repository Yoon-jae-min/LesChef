/**
 * 홈 중앙 — 레시피 둘러보기 (인기/최신 카드 + 카테고리 칩)
 */

"use client";

import Link from "next/link";
import { useId } from "react";
import useSWR from "swr";
import RecipeCard from "@/components/recipe/card/RecipeCard";
import {
  fetchRecipeList,
  type RecipeListResponse,
} from "@/utils/api/recipeApi";
import { TIMING } from "@/constants/system/timing";
import ErrorMessage from "@/components/common/ui/ErrorMessage";
import CategoryPreview from "./CategoryPreview";

export default function HomeRecipeBrowse() {
  const headingId = useId();

  const popular = useSWR<RecipeListResponse>(
    ["home-recipe-popular", "popular", 1],
    () => fetchRecipeList({ category: "all", sort: "popular", limit: 1 }),
    {
      dedupingInterval: TIMING.FIVE_MINUTES,
      revalidateOnFocus: false,
    }
  );

  const latest = useSWR<RecipeListResponse>(
    ["home-recipe-latest", "latest", 1],
    () => fetchRecipeList({ category: "all", sort: "latest", limit: 1 }),
    {
      dedupingInterval: TIMING.FIVE_MINUTES,
      revalidateOnFocus: false,
    }
  );

  const isLoading = popular.isLoading || latest.isLoading;
  const error = popular.error || latest.error;
  const popularRecipe = popular.data?.list?.[0];
  const latestRecipe = latest.data?.list?.[0];

  return (
    <section aria-labelledby={headingId} className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 id={headingId} className="text-xl font-bold text-gray-900">
          레시피 둘러보기
        </h2>
        <Link
          href="/recipe/all"
          className="shrink-0 text-sm font-medium text-green-600 transition-colors hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 rounded-lg"
        >
          전체보기
        </Link>
      </div>

      {error ? (
        <ErrorMessage
          error={error}
          showDetails={false}
          showAction={true}
          onRetry={() => {
            void popular.mutate();
            void latest.mutate();
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {isLoading ? (
            <>
              <div className="h-64 animate-pulse rounded-[28px] border border-gray-200 bg-gray-100" />
              <div className="h-64 animate-pulse rounded-[28px] border border-gray-200 bg-gray-100" />
            </>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-green-700">인기 레시피</p>
                {popularRecipe ? (
                  <RecipeCard recipe={popularRecipe} />
                ) : (
                  <p className="rounded-2xl border border-dashed border-gray-200 px-4 py-10 text-center text-sm text-gray-500">
                    인기 레시피가 없습니다.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-green-700">최신 레시피</p>
                {latestRecipe ? (
                  <RecipeCard recipe={latestRecipe} />
                ) : (
                  <p className="rounded-2xl border border-dashed border-gray-200 px-4 py-10 text-center text-sm text-gray-500">
                    최신 레시피가 없습니다.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <CategoryPreview variant="chips" />
    </section>
  );
}
