/**
 * 식품/음식 네이버 쇼핑 검색 API
 */

import { API_CONFIG } from "@/config/apiConfig";
import { authFetch } from "@/utils/api/authFetch";

const API_BASE_URL = API_CONFIG.BASE_URL;

export type FoodSearchItem = {
  title: string;
  link: string;
  image: string;
  lprice: number;
  hprice: number;
  mallName: string;
  productId: string;
  brand?: string;
  maker?: string;
  category1?: string;
  category2?: string;
  category3?: string;
  category4?: string;
};

export type FoodSearchResponse = {
  error: boolean;
  data: FoodSearchItem[];
  query: string;
  total: number;
  message?: string;
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

export const searchFoodProducts = async (query: string): Promise<FoodSearchResponse> => {
  const q = query.trim();
  if (!q) {
    throw new Error("검색어를 입력해 주세요.");
  }

  const response = await authFetch(
    `${API_BASE_URL}/food-search?q=${encodeURIComponent(q)}&display=12`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error(await parseError(response, `식품 검색 실패: ${response.status}`));
  }

  return (await response.json()) as FoodSearchResponse;
};
