/**
 * 레시피 조회 API 함수
 * 리스트, 상세, 내 레시피, 찜한 레시피 조회
 */

import { API_CONFIG } from "@/config/apiConfig";
import { authFetch } from "@/utils/api/authFetch";
import { handleApiError } from "@/utils/helpers/error";
import type {
  RecipeListParams,
  RecipeListResponse,
  RecipeDetailResponse,
  MyRecipeListResponse,
  WishRecipeListResponse,
} from "@/types/recipe";

export type RecipeDetailApiBody = RecipeDetailResponse & {
  error?: boolean;
  message?: string;
};

const API_BASE_URL = API_CONFIG.RECIPE_API;

/**
 * 레시피 리스트 조회 (단일 엔드포인트)
 */
export const fetchRecipeList = async (
  params: RecipeListParams = {}
): Promise<RecipeListResponse> => {
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
 * 레시피 상세 조회 (MongoDB _id)
 */
export const fetchRecipeDetailById = async (recipeId: string): Promise<RecipeDetailResponse> => {
  if (!recipeId) {
    throw new Error("레시피 ID가 필요합니다.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/info?id=${encodeURIComponent(recipeId)}`, {
      method: "GET",
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
 * 레시피 수정 폼용 상세 조회 (MongoDB _id, 로그인·소유자 검증은 백엔드)
 */
export const fetchRecipeForEdit = async (recipeId: string): Promise<RecipeDetailResponse> => {
  if (!recipeId) {
    throw new Error("레시피 ID가 필요합니다.");
  }

  try {
    const response = await authFetch(
      `${API_BASE_URL}/info?id=${encodeURIComponent(recipeId)}&forEdit=1`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw await handleApiError(response);
    }

    const body = (await response.json()) as RecipeDetailApiBody;
    if (body.error === true) {
      throw new Error(body.message || "레시피를 불러올 수 없습니다.");
    }

    return body;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("레시피를 불러오는 중 네트워크 오류가 발생했습니다.");
  }
};

/**
 * 나의 레시피 리스트
 */
export const fetchMyRecipeList = async (): Promise<MyRecipeListResponse> => {
  try {
    const response = await authFetch(`${API_BASE_URL}/myList`, {
      method: "GET",
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
    const response = await authFetch(`${API_BASE_URL}/wishList`, {
      method: "GET",
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
