/**
 * 레시피 CRUD API 함수
 * 생성, 수정, 삭제 관련 함수들
 */

import { API_CONFIG } from "@/config/apiConfig";
import { handleApiError } from "@/utils/helpers/error";
import type { RecipeSubmitData, RecipeInfo } from "@/types/recipe";
import { transformIngredients, transformSteps } from "./transformers";

const API_BASE_URL = API_CONFIG.RECIPE_API;

/**
 * 레시피 작성/수정 데이터를 서버로 전송
 * @param data 레시피 제출 데이터
 * @returns Promise<Response>
 */
export const submitRecipe = async (data: RecipeSubmitData): Promise<Response> => {
  const { recipeInfo, ingredientGroups, steps, recipeImgFile, isEdit, recipeId, deleteImgs } = data;

  // FormData 생성
  const formData = new FormData();

  // recipeInfo 준비
  const recipeInfoData: RecipeInfo = {
    ...recipeInfo,
    viewCount: recipeInfo.viewCount || 0,
  };

  if (isEdit && recipeId) {
    recipeInfoData._id = recipeId;
  }

  // JSON 문자열로 변환하여 FormData에 추가
  formData.append("recipeInfo", JSON.stringify(recipeInfoData));

  // 재료 데이터 변환 및 추가 (recipeId는 서버에서 주입)
  const transformedIngredients = transformIngredients(ingredientGroups);
  formData.append("recipeIngredients", JSON.stringify(transformedIngredients));

  // 조리 단계 데이터 변환 및 추가
  const transformedSteps = transformSteps(steps);
  formData.append("recipeSteps", JSON.stringify(transformedSteps));

  // isEdit 플래그 추가
  formData.append("isEdit", JSON.stringify(isEdit || false));

  // edit 모드일 때 삭제할 이미지 URL 배열 추가
  if (isEdit && deleteImgs && deleteImgs.length > 0) {
    deleteImgs.forEach((imgUrl) => {
      formData.append("deleteImgs", imgUrl);
    });
  }

  // 대표 이미지 파일 추가
  if (recipeImgFile) {
    formData.append("recipeImgFile", recipeImgFile);
  }

  // 조리 단계 이미지 파일들 추가
  steps.forEach((step) => {
    if (step.stepImgFile) {
      formData.append("recipeStepImgFiles", step.stepImgFile);
    }
  });

  // 서버로 전송
  try {
    const response = await fetch(`${API_BASE_URL}/write`, {
      method: "POST",
      body: formData,
      // FormData를 사용할 때는 Content-Type을 설정하지 않음 (브라우저가 자동으로 설정)
      credentials: "include", // 세션 쿠키를 포함하기 위해
    });

    if (!response.ok) {
      throw await handleApiError(response);
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("레시피 제출 중 네트워크 오류가 발생했습니다.");
  }
};

/**
 * 레시피 작성 전용 함수 (편의 함수)
 */
export const createRecipe = async (
  data: Omit<RecipeSubmitData, "isEdit" | "recipeId" | "deleteImgs">
): Promise<Response> => {
  return submitRecipe({
    ...data,
    isEdit: false,
  });
};

/**
 * 레시피 수정 전용 함수 (편의 함수)
 */
export const updateRecipe = async (
  data: Omit<RecipeSubmitData, "isEdit"> & { recipeId: string; deleteImgs?: string[] }
): Promise<Response> => {
  return submitRecipe({
    ...data,
    isEdit: true,
  });
};

/**
 * 레시피 삭제
 * @param recipeId 레시피 ID
 * @returns Promise<Response>
 */
export const deleteRecipe = async (recipeId: string): Promise<Response> => {
  if (!recipeId) {
    throw new Error("레시피 ID가 필요합니다.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${recipeId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      let errorMessage = `레시피 삭제 실패: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("레시피 삭제 중 네트워크 오류가 발생했습니다.");
  }
};
