/**
 * 레시피 찜 기능 API 함수
 */

import { API_CONFIG } from "@/config/apiConfig";
import type { ToggleWishResponse } from "@/types/recipe";

const API_BASE_URL = API_CONFIG.RECIPE_API;

/**
 * 레시피 찜 토글
 */
export const toggleRecipeWish = async (recipeId: string): Promise<ToggleWishResponse> => {
  if (!recipeId) {
    throw new Error("레시피 ID가 필요합니다.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/clickwish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipeId }),
      credentials: "include",
    });

    if (!response.ok) {
      let errorMessage = `찜 요청 실패: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("찜 요청 중 네트워크 오류가 발생했습니다.");
  }
};

