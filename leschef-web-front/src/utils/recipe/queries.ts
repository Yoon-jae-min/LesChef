/**
 * 레시피 조회 API 함수
 * 리스트, 상세, 내 레시피, 찜한 레시피 조회
 */

import { API_CONFIG } from "@/config/apiConfig";
import { handleApiError } from "@/utils/helpers/error";
import type {
  RecipeListParams,
  RecipeListResponse,
  RecipeDetailResponse,
  MyRecipeListResponse,
  WishRecipeListResponse,
} from "@/types/recipe";

const API_BASE_URL = API_CONFIG.RECIPE_API;

/**
 * 레시피 리스트 조회 (단일 엔드포인트)
 */
export const fetchRecipeList = async (params: RecipeListParams = {}): Promise<RecipeListResponse> => {
  try {
    const query = new URLSearchParams();
    if (params.category) query.set("category", params.category);
    if (params.subCategory) query.set("subCategory", params.subCategory);
    if (typeof params.isShare !== "undefined") query.set("isShare", String(params.isShare));
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.sort) query.set("sort", params.sort);
    if (params.keyword) query.set("keyword", params.keyword);
    if (params.tag) query.set("tag", params.tag);

    const response = await fetch(`${API_BASE_URL}/list?${query.toString()}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw await handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("레시피 리스트 조회 중 네트워크 오류가 발생했습니다.");
  }
};

/**
 * 레시피 상세 조회 (recipeName 기준)
 */
export const fetchRecipeDetail = async (recipeName: string): Promise<RecipeDetailResponse> => {
  if (!recipeName) {
    throw new Error("레시피 이름이 필요합니다.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/info?recipeName=${encodeURIComponent(recipeName)}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      let errorMessage = `레시피 상세 조회 실패: ${response.status}`;
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
    throw new Error("레시피 상세 조회 중 네트워크 오류가 발생했습니다.");
  }
};

/**
 * 나의 레시피 리스트
 */
export const fetchMyRecipeList = async (): Promise<MyRecipeListResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/myList`, {
      method: "GET",
      credentials: "include",
    });
    
    if (!response.ok) {
      let errorMessage = `나의 레시피 조회 실패: ${response.status}`;
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
    throw new Error("나의 레시피 조회 중 네트워크 오류가 발생했습니다.");
  }
};

/**
 * 찜한 레시피 리스트
 */
export const fetchWishRecipeList = async (): Promise<WishRecipeListResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishList`, {
      method: "GET",
      credentials: "include",
    });
    
    if (!response.ok) {
      let errorMessage = `찜한 레시피 조회 실패: ${response.status}`;
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
    throw new Error("찜한 레시피 조회 중 네트워크 오류가 발생했습니다.");
  }
};

