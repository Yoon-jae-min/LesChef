import { API_CONFIG } from "@/config/apiConfig";

const API_BASE_URL = API_CONFIG.CUSTOMER_API;

export type SocialProvider = "kakao" | "google" | "naver";

/**
 * SNS 계정 연동 해제
 */
export const unlinkSocial = async (provider: SocialProvider): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/unlink/${provider}`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      let errorMessage = `연동 해제 실패: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("연동 해제 중 네트워크 오류가 발생했습니다.");
  }
};

