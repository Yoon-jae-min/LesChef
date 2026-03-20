/**
 * 유저 정보 API 함수
 * 유저 정보 조회 관련 함수들
 */

import { API_CONFIG } from "@/config/apiConfig";
import type { UserInfoResponse } from "./types";

const API_BASE_URL = API_CONFIG.CUSTOMER_API;

/**
 * 유저 정보 조회
 * @returns Promise<UserInfoResponse>
 */
export const fetchUserInfo = async (): Promise<UserInfoResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/info`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      let errorMessage = `유저 정보 조회 실패: ${response.status}`;
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
    throw new Error("유저 정보 조회 중 네트워크 오류가 발생했습니다.");
  }
};
