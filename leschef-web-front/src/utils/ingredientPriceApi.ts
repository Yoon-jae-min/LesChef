/**
 * 식재료 물가 API 유틸리티 함수
 * 백엔드를 통해 공공데이터포털 API를 호출하여 식재료 물가 정보를 가져오는 함수들
 */

// API 베이스 URL (백엔드 서버 주소)
// 프로덕션 환경에서는 환경 변수나 설정 파일에서 관리하는 것을 권장
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:443";

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
    const response = await fetch(`${API_BASE_URL}/ingredient-price`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 세션 쿠키 포함 (필요한 경우)
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

