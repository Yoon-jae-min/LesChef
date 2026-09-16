/**
 * 식재료 물가 API
 * curated(기본): 주요 품목 스냅샷 / search: 자유검색
 */

import { API_CONFIG } from "@/config/apiConfig";
import { authFetch } from "@/utils/api/authFetch";

const API_BASE_URL = API_CONFIG.BASE_URL;

export type IngredientPriceItem = {
  id?: string;
  name: string;
  price: number;
  unit: string;
  change?: number;
  changeRate?: number;
  date?: string;
  kindName?: string;
  categoryName?: string;
  source?: "retail" | "wholesale";
};

export type IngredientPriceResponse = {
  error: boolean;
  data: IngredientPriceItem[];
  date: string;
  message?: string;
  query?: string;
  mode?: "curated" | "search";
  disclaimer?: string;
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

/** 주요 식재료 시세 스냅샷 */
export const fetchCuratedIngredientPrices = async (): Promise<IngredientPriceResponse> => {
  const response = await authFetch(`${API_BASE_URL}/ingredient-price/curated`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(await parseError(response, `식재료 시세 조회 실패: ${response.status}`));
  }

  return (await response.json()) as IngredientPriceResponse;
};

/** 검색 (curated 모드면 주요 품목 필터) */
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
