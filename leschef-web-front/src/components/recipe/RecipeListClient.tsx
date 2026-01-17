"use client";

import useSWR from "swr";
import RecipeCard from "./RecipeCard";
import {
  fetchRecipeList,
  type RecipeListResponse,
  type RecipeListParams,
} from "@/utils/recipeApi";
import { RECIPE_CATEGORY_TO_API } from "@/constants/categories";
import { TIMING } from "@/constants/timing";

interface RecipeListClientProps {
  initialCategory: string;
  initialData?: RecipeListResponse | null; // 서버에서 가져온 초기 데이터
  initialError?: string | null; // 서버에서 발생한 에러
}

/**
 * 레시피 목록 클라이언트 컴포넌트
 * 서버에서 가져온 초기 데이터를 사용하고, SWR로 실시간 업데이트
 */
export default function RecipeListClient({ 
  initialCategory, 
  initialData, 
  initialError 
}: RecipeListClientProps) {
  const apiCategory = RECIPE_CATEGORY_TO_API[initialCategory] || "korean";

  // 레시피 목록 가져오기 - SWR 캐싱 적용
  // 서버에서 가져온 초기 데이터가 있으면 fallbackData로 사용
  const { data, error, isLoading: loading } = useSWR<RecipeListResponse>(
    ['recipe-list', apiCategory], // 캐시 키: 카테고리별로 별도 캐시
    () => fetchRecipeList({
      category: apiCategory as RecipeListParams["category"],
    }),
    {
      dedupingInterval: TIMING.FIVE_MINUTES, // 5분 동안 중복 요청 방지
      fallbackData: initialData || undefined, // 서버에서 가져온 초기 데이터 사용
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
      <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {displayError instanceof Error ? displayError.message : "레시피를 불러오지 못했습니다."}
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
      {recipes.map((recipe) => (
        <RecipeCard key={recipe._id || recipe.recipeName} recipe={recipe} />
      ))}
    </>
  );
}

