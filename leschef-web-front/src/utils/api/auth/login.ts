/**
 * 로그인/로그아웃 API 함수
 * 로그인 및 로그아웃 관련 함수들
 */

import { API_CONFIG } from "@/config/apiConfig";
import type { LoginData, LoginResponse } from "./types";
import { setTokens } from "@/utils/helpers/tokenStorage";
import { getRefreshToken, clearTokens } from "@/utils/helpers/tokenStorage";

const API_BASE_URL = API_CONFIG.CUSTOMER_API;

/**
 * 로그인
 * @param data 로그인 데이터
 * @returns Promise<LoginResponse>
 */
export const login = async (data: LoginData): Promise<LoginResponse> => {
  const { customerId, customerPwd } = data;

  if (!customerId || !customerPwd) {
    throw new Error("아이디와 비밀번호를 입력해주세요.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId,
        customerPwd,
      }),
    });

    if (!response.ok) {
      let errorMessage = `로그인 실패: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result: LoginResponse & { accessToken?: string; refreshToken?: string } = await response.json();
    if (result.accessToken && result.refreshToken) {
      setTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken });
    }
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("로그인 중 네트워크 오류가 발생했습니다.");
  }
};

/**
 * 로그아웃
 * @returns Promise<Response>
 */
export const logout = async (): Promise<Response> => {
  try {
    const refreshToken = getRefreshToken();
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "GET",
      headers: refreshToken ? { "X-Refresh-Token": refreshToken } : undefined,
    });

    if (!response.ok) {
      let errorMessage = `로그아웃 실패: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    clearTokens();
    return response;
  } catch (error) {
    clearTokens();
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("로그아웃 중 네트워크 오류가 발생했습니다.");
  }
};
