/**
 * 서버 컴포넌트용 API 유틸리티 함수
 * 서버에서 직접 API를 호출할 때 사용
 * 쿠키를 자동으로 전달하여 인증 처리
 */

import { cookies } from "next/headers";
import { API_CONFIG } from "@/config/apiConfig";
import type { IngredientPriceResponse } from "@/utils/api/ingredientPrice";

// API 베이스 URL
const API_BASE_URL = API_CONFIG.BASE_URL;
const RECIPE_API_BASE_URL = API_CONFIG.RECIPE_API;
const BOARD_API_BASE_URL = API_CONFIG.BOARD_API;

/**
 * 서버에서 쿠키를 포함하여 fetch 요청
 */
async function serverFetch(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();

  // 모든 쿠키를 가져와서 Cookie 헤더 문자열로 변환
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Cookie: cookieHeader, // 서버에서 쿠키 전달
    },
    // 서버 컴포넌트에서는 credentials 불필요 (쿠키를 직접 헤더에 포함)
    cache: options.cache || "no-store", // 기본적으로 캐시 안 함 (서버 컴포넌트는 자체 캐싱)
  });
}

/**
 * 레시피 리스트 조회 (서버 컴포넌트용)
 */
export async function getRecipeListServer(params: {
  category?: string;
  subCategory?: string;
  page?: number;
  limit?: number;
  sort?: string;
}) {
  try {
    const query = new URLSearchParams();
    if (params.category) query.set("category", params.category);
    if (params.subCategory) query.set("subCategory", params.subCategory);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.sort) query.set("sort", params.sort);

    const response = await serverFetch(`${RECIPE_API_BASE_URL}/list?${query.toString()}`);

    if (!response.ok) {
      throw new Error(`레시피 리스트 조회 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("서버에서 레시피 리스트 조회 실패:", error);
    }
    throw error;
  }
}

/**
 * 레시피 상세 조회 (서버 컴포넌트용, MongoDB _id)
 */
export async function getRecipeDetailServer(recipeId: string) {
  try {
    const response = await serverFetch(
      `${RECIPE_API_BASE_URL}/info?id=${encodeURIComponent(recipeId)}`
    );

    if (!response.ok) {
      throw new Error(`레시피 상세 조회 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("서버에서 레시피 상세 조회 실패:", error);
    }
    throw error;
  }
}

/**
 * 식재료 물가 정보 조회 (서버 컴포넌트용)
 * 백엔드 미기동·URL 오류 등으로 fetch 가 실패해도 예외를 던지지 않고 null 반환 (홈 RSC 깨짐 방지)
 */
export async function getIngredientPricesServer(): Promise<IngredientPriceResponse | null> {
  try {
    const response = await serverFetch(`${API_BASE_URL}/ingredient-price`, {
      signal: AbortSignal.timeout(12_000),
    });

    if (!response.ok) {
      if (process.env.NODE_ENV === "development") {
        console.error("서버에서 식재료 물가 정보 조회 실패:", response.status);
      }
      return null;
    }

    return (await response.json()) as IngredientPriceResponse;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("서버에서 식재료 물가 정보 조회 실패:", error);
    }
    return null;
  }
}

/**
 * 게시글 리스트 조회 (서버 컴포넌트용)
 */
export async function getBoardListServer(params: {
  page?: number;
  limit?: number;
  type?: "notice" | "free";
}) {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.type) query.set("type", params.type);

    const response = await serverFetch(`${BOARD_API_BASE_URL}/list?${query.toString()}`);

    if (!response.ok) {
      throw new Error(`게시글 리스트 조회 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("서버에서 게시글 리스트 조회 실패:", error);
    }
    throw error;
  }
}

/**
 * 게시글 상세 조회 (서버 컴포넌트용)
 */
export async function getBoardDetailServer(postId: string) {
  try {
    const response = await serverFetch(
      `${BOARD_API_BASE_URL}/watch?id=${encodeURIComponent(postId)}`
    );

    if (!response.ok) {
      throw new Error(`게시글 상세 조회 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("서버에서 게시글 상세 조회 실패:", error);
    }
    throw error;
  }
}
