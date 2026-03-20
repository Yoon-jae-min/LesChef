/**
 * 레시피 데이터 변환 유틸리티
 * 프론트엔드 형식을 백엔드 형식으로 변환
 */

import type { IngredientGroup, RecipeStep } from "@/types/recipe";

/**
 * 재료 데이터를 백엔드 형식으로 변환
 */
export const transformIngredients = (
  ingredientGroups: IngredientGroup[]
): Array<{
  sortType: string;
  ingredientUnit: Array<{
    ingredientName: string;
    volume: number;
    unit: string;
  }>;
}> => {
  return ingredientGroups.map((group) => ({
    sortType: group.sortType,
    ingredientUnit: group.ingredients.map((ingredient) => ({
      ingredientName: ingredient.ingredientName,
      volume: ingredient.volume,
      unit: ingredient.unit,
    })),
  }));
};

/**
 * 조리 단계 데이터를 백엔드 형식으로 변환
 */
export const transformSteps = (
  steps: RecipeStep[]
): Array<{
  stepNum: number;
  stepWay: string;
  stepImg: string;
}> => {
  return steps.map((step) => ({
    stepNum: step.stepNum,
    stepWay: step.stepWay,
    stepImg: step.stepImg.startsWith("data:") ? "" : step.stepImg, // 새로 업로드한 이미지는 빈 문자열
  }));
};
