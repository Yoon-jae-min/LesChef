/**
 * 식재료 물가 API 유틸리티
 * 백엔드: KAMIS #15 코드표 + #17 소매가 검색
 */

import { API_CONFIG } from "@/config/apiConfig";
import { authFetch } from "@/utils/api/authFetch";

const API_BASE_URL = API_CONFIG.BASE_URL;

export type IngredientPriceItem = {
  name: string;
  price: number;
  unit: string;
  change?: number;
  changeRate?: number;
  date?: string;
  kindName?: string;
  categoryName?: string;
};

export type IngredientPriceResponse = {
  error: boolean;
  data: IngredientPriceItem[];
  date: string;
  message?: string;
  query?: string;
};

async function parseError(response: Response, fallback: string): Promise<string> {
  try {
    const errorData = await response.json();
    return errorData.message || errorData.error || fallback;
  } catch {
    const text = await response.text();
    return text || fallback;
  }
}

/**
 * 식재료 이름 검색 → 소매가
 */
export const searchIngredientPrices = async (
  query: string
): Promise<IngredientPriceResponse> => {
  const q = query.trim();
  if (!q) {
    throw new Error("검색어를 입력해 주세요.");
  }

  try {
    const response = await authFetch(
      `${API_BASE_URL}/ingredient-price/search?q=${encodeURIComponent(q)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error(
        await parseError(response, `식재료 가격 검색 실패: ${response.status}`)
      );
    }

    return (await response.json()) as IngredientPriceResponse;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("식재료 가격 검색 중 네트워크 오류가 발생했습니다.");
  }
};
