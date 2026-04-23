"use client";

import { useState, useCallback, useEffect } from "react";
import useSWR from "swr";
import RecipeCard from "../card/RecipeCard";
import SearchBar from "../search/SearchBar";
import {
  fetchRecipeList,
  type RecipeListResponse,
  type RecipeListParams,
  type RecipeSortOption,
} from "@/utils/api/recipeApi";
import { RECIPE_CATEGORY_TO_API } from "@/constants/navigation/categories";
import { TIMING } from "@/constants/system/timing";
import { RECIPE_SORT_LABELS, DEFAULT_SORT_OPTION } from "@/constants/recipe/recipe";
import ErrorMessage from "@/components/common/ui/ErrorMessage";

/** URL 쿼리에서 레시피 검색어 (`keyword`만 사용) */
function keywordFromSearchParams(search: string): string {
  const params = new URLSearchParams(search);
  return params.get("keyword")?.trim() || "";
}

interface ListProps {
  initialCategory: string;
  initialData?: RecipeListResponse | null; // 서버에서 가져온 초기 데이터
  initialError?: string | null; // 서버에서 발생한 에러
  /** URL·서버와 맞춘 초기 서브 카테고리(전체가 아닐 때만) */
  initialSubCategory?: string;
}

/**
 * 레시피 목록 클라이언트 컴포넌트
 * 서버에서 가져온 초기 데이터를 사용하고, SWR로 실시간 업데이트
 */
function subCategoryFromSearch(search: string): string {
  const raw = new URLSearchParams(search).get("subCategory")?.trim();
  return raw && raw.length > 0 && raw !== "전체" ? raw : "";
}

export default function List({
  initialCategory,
  initialData,
  initialError,
  initialSubCategory,
}: ListProps) {
  const apiCategory = RECIPE_CATEGORY_TO_API[initialCategory] || "korean";
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [sortOption, setSortOption] = useState<RecipeSortOption>(DEFAULT_SORT_OPTION);
  const [subCategory, setSubCategory] = useState<string>(() => {
    const fromServer = initialSubCategory?.trim();
    if (fromServer && fromServer !== "전체") return fromServer;
    return "";
  });

  const syncFromUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const keyword = keywordFromSearchParams(search);
    const sort = (params.get("sort") as RecipeSortOption) || DEFAULT_SORT_OPTION;
    setSearchKeyword(keyword);
    setSortOption(sort);
    setSubCategory(subCategoryFromSearch(search));
  }, []);

  // URL에서 검색어·정렬·서브 카테고리
  useEffect(() => {
    syncFromUrl();
  }, [syncFromUrl]);

  useEffect(() => {
    const handlePopState = () => syncFromUrl();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [syncFromUrl]);

  // 검색 핸들러
  const handleSearch = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
    // URL 업데이트
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.delete("ingredients"); // 예전 링크 호환(무시)
      const trimmed = keyword.trim();
      if (trimmed) {
        params.set("keyword", trimmed);
      } else {
        params.delete("keyword");
      }
      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      window.history.pushState({}, "", newUrl);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, []);

  // 정렬 옵션 변경 핸들러
  const handleSortChange = useCallback((sort: RecipeSortOption) => {
    setSortOption(sort);
    // URL 업데이트
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (sort !== DEFAULT_SORT_OPTION) {
        params.set("sort", sort);
      } else {
        params.delete("sort");
      }
      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      window.history.pushState({}, "", newUrl);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, []);

  // 레시피 목록 가져오기 - SWR 캐싱 적용
  // 서버에서 가져온 초기 데이터가 있으면 fallbackData로 사용
  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<RecipeListResponse>(
    ["recipe-list", apiCategory, searchKeyword, sortOption, subCategory],
    () =>
      fetchRecipeList({
        category: apiCategory as RecipeListParams["category"],
        keyword: searchKeyword || undefined,
        sort: sortOption,
        subCategory: subCategory || undefined,
      }),
    {
      dedupingInterval: TIMING.FIVE_MINUTES, // 5분 동안 중복 요청 방지
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 1500,
      revalidateOnReconnect: true,
      fallbackData:
        searchKeyword ||
        sortOption !== DEFAULT_SORT_OPTION ||
        (subCategory && subCategory.length > 0)
          ? undefined
          : initialData || undefined,
    }
  );

  const displayError = error || (initialError ? new Error(initialError) : null);
  /** 캐시·fallback 없이 첫 응답 대기 중이면 목록 영역만 스켈레톤 */
  const awaitingList = isLoading && !data;
  const recipes = data?.list ?? initialData?.list ?? [];
  const totalCount =
    data?.total ?? (!awaitingList ? (initialData?.total ?? 0) : undefined);

  return (
    <>
      <div className="col-span-full mb-6 space-y-4 rounded-2xl border border-stone-200/90 bg-white/95 p-4 shadow-sm sm:p-5">
        <SearchBar onSearch={handleSearch} initialKeyword={searchKeyword} />

        <div className="flex flex-col gap-4 border-t border-stone-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-stone-600">
            총{" "}
            {typeof totalCount === "number" ? (
              <span className="inline-flex min-w-[2ch] items-center justify-center rounded-md bg-orange-50 px-1.5 py-0.5 font-semibold tabular-nums text-orange-800">
                {totalCount}
              </span>
            ) : (
              <span className="text-stone-400">…</span>
            )}
            <span className="ml-1">개의 레시피</span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="sort-select" className="text-sm font-medium text-stone-700">
              정렬
            </label>
            <select
              id="sort-select"
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value as RecipeSortOption)}
              className="min-h-10 cursor-pointer rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-800 shadow-sm transition-colors hover:border-orange-200 hover:bg-orange-50/40 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
            >
              {Object.entries(RECIPE_SORT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {searchKeyword && (
        <div className="col-span-full mb-3 rounded-xl border border-orange-100 bg-orange-50/70 px-4 py-2.5 text-sm text-stone-700">
          <span className="font-medium text-stone-800">&quot;{searchKeyword}&quot;</span> 검색 결과:{" "}
          {awaitingList ? <span className="text-stone-400">…</span> : data?.total ?? 0}개
        </div>
      )}

      {subCategory && (
        <div className="col-span-full mb-3 rounded-xl border border-stone-200 bg-stone-50/80 px-4 py-2.5 text-sm text-stone-700">
          서브 카테고리{" "}
          <span className="font-semibold text-stone-900">{subCategory}</span> ·{" "}
          {awaitingList ? <span className="text-stone-400">…</span> : (data?.total ?? 0)}개
        </div>
      )}

      {displayError && (
        <div className="col-span-full">
          <ErrorMessage
            error={displayError}
            showDetails={false}
            showAction={true}
            onRetry={() => void mutate()}
          />
        </div>
      )}

      {!displayError && awaitingList && (
        <div
          className="col-span-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8"
          aria-busy="true"
          aria-live="polite"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-[28px] border border-stone-200/80 bg-gradient-to-br from-stone-100 to-stone-50"
            />
          ))}
        </div>
      )}

      {!displayError && !awaitingList && recipes.length === 0 && (
        <div className="col-span-full rounded-3xl border border-dashed border-stone-300 bg-white/90 px-6 py-14 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-2xl text-orange-600" aria-hidden>🥘</div>
          <p className="font-medium text-stone-900">조건에 맞는 레시피가 없습니다.</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
            검색어를 바꾸거나, 정렬·카테고리·서브 필터를 조정해 다시 찾아보세요.
          </p>
        </div>
      )}

      {!displayError && !awaitingList && recipes.length > 0 && (
        <>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id || recipe.recipeName} recipe={recipe} />
          ))}
        </>
      )}
    </>
  );
}
