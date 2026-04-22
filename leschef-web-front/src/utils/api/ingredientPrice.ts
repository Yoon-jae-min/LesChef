/**
 * 식재료 물가 API 유틸리티 함수
 * 백엔드를 통해 공공데이터포털 API를 호출하여 식재료 물가 정보를 가져오는 함수들
 */

import { API_CONFIG } from "@/config/apiConfig";
import { authFetch } from "@/utils/api/authFetch";

const API_BASE_URL = API_CONFIG.BASE_URL;

export type IngredientPriceItem = {
  name: string;
  price: number;
  unit: string;
  change?: number; // 전일 대비 변동액
  changeRate?: number; // 변동률 (%)
  date?: string; // 기준일
};

export type IngredientPriceResponse = {
  error: boolean;
  data: IngredientPriceItem[];
  date: string;
  message?: string;
};

/**
 * 식재료 물가 정보 조회
 * 백엔드 API를 통해 공공데이터포털 API를 호출합니다.
 * @returns Promise<IngredientPriceResponse>
 */
export const getIngredientPrices = async (): Promise<IngredientPriceResponse> => {
  try {
    const response = await authFetch(`${API_BASE_URL}/ingredient-price`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorMessage = `식재료 물가 정보 조회 실패: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result: IngredientPriceResponse = await response.json();
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("식재료 물가 정보 조회 중 네트워크 오류가 발생했습니다.");
  }
};
