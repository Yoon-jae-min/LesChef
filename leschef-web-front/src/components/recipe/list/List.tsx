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

interface ListProps {
  initialCategory: string;
  initialData?: RecipeListResponse | null; // 서버에서 가져온 초기 데이터
  initialError?: string | null; // 서버에서 발생한 에러
}

/**
 * 레시피 목록 클라이언트 컴포넌트
 * 서버에서 가져온 초기 데이터를 사용하고, SWR로 실시간 업데이트
 */
export default function List({ initialCategory, initialData, initialError }: ListProps) {
  const apiCategory = RECIPE_CATEGORY_TO_API[initialCategory] || "korean";
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [sortOption, setSortOption] = useState<RecipeSortOption>(DEFAULT_SORT_OPTION);

  // URL에서 검색어 및 정렬 옵션 가져오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const keyword = params.get("keyword") || "";
      const sort = (params.get("sort") as RecipeSortOption) || DEFAULT_SORT_OPTION;
      setSearchKeyword(keyword);
      setSortOption(sort);
    }
  }, []);

  // URL 변경 감지
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const keyword = params.get("keyword") || "";
        const sort = (params.get("sort") as RecipeSortOption) || DEFAULT_SORT_OPTION;
        setSearchKeyword(keyword);
        setSortOption(sort);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // 검색 핸들러
  const handleSearch = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
    // URL 업데이트
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (keyword) {
        params.set("keyword", keyword);
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
    isLoading: loading,
  } = useSWR<RecipeListResponse>(
    ["recipe-list", apiCategory, searchKeyword, sortOption], // 캐시 키: 카테고리, 검색어, 정렬 옵션별로 별도 캐시
    () =>
      fetchRecipeList({
        category: apiCategory as RecipeListParams["category"],
        keyword: searchKeyword || undefined,
        sort: sortOption,
      }),
    {
      dedupingInterval: TIMING.FIVE_MINUTES, // 5분 동안 중복 요청 방지
      fallbackData:
        searchKeyword || sortOption !== DEFAULT_SORT_OPTION ? undefined : initialData || undefined, // 검색어나 정렬 옵션이 있을 때는 초기 데이터 사용 안 함
    }
  );

  // 서버 에러가 있으면 우선 표시
  const displayError = error || (initialError ? new Error(initialError) : null);
  const recipes = data?.list || initialData?.list || [];

  if (loading) {
    return (
      <div className="col-span-full flex items-center justify-center py-16 text-sm text-gray-500">
        레시피를 불러오는 중입니다...
      </div>
    );
  }

  if (displayError) {
    return (
      <div className="col-span-full">
        <ErrorMessage
          error={displayError}
          showDetails={false}
          showAction={true}
          onRetry={() => {
            // SWR 재시도 (캐시 무효화 후 재요청)
            window.location.reload();
          }}
        />
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="col-span-full flex items-center justify-center py-16 text-sm text-gray-500">
        레시피가 없습니다.
      </div>
    );
  }

  return (
    <>
      {/* 검색바 및 정렬 옵션 */}
      <div className="col-span-full mb-4 space-y-3">
        <SearchBar onSearch={handleSearch} initialKeyword={searchKeyword} />

        {/* 정렬 옵션 선택 */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm text-gray-600">
            총 {data?.total || initialData?.total || 0}개의 레시피
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
              정렬:
            </label>
            <select
              id="sort-select"
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value as RecipeSortOption)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
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

      {/* 검색 결과 표시 */}
      {searchKeyword && (
        <div className="col-span-full mb-2 text-sm text-gray-600">
          &quot;{searchKeyword}&quot; 검색 결과: {data?.total || 0}개
        </div>
      )}

      {/* 레시피 목록 */}
      {recipes.map((recipe) => (
        <RecipeCard key={recipe._id || recipe.recipeName} recipe={recipe} />
      ))}
    </>
  );
}
