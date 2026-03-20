/**
 * 인증 확인 API 함수
 * 인증 상태 확인 관련 함수들
 */

import { API_CONFIG } from "@/config/apiConfig";

const API_BASE_URL = API_CONFIG.CUSTOMER_API;

/**
 * 인증 상태 확인
 * @returns Promise<{ loggedIn: boolean }>
 */
export const checkAuth = async (): Promise<{ loggedIn: boolean }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      // 인증 확인 실패는 로그인 안 된 것으로 처리
      return { loggedIn: false };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    // 네트워크 오류 시 로그인 안 된 것으로 처리
    return { loggedIn: false };
  }
};
