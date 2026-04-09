/**
 * 유저 정보 API 함수
 * 유저 정보 조회 관련 함수들
 */

import { API_CONFIG } from "@/config/apiConfig";
import type { UserInfoResponse, UpdateUserProfileParams } from "./types";

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

/**
 * 로그인 세션 기준 프로필 수정 (닉네임·전화번호)
 */
export const updateUserProfile = async (params: UpdateUserProfileParams): Promise<void> => {
  const nickName = params.nickName?.trim();
  if (!nickName) {
    throw new Error("닉네임을 입력해주세요.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/info`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        nickName,
        tel: params.tel?.trim() ?? "",
      }),
    });

    if (!response.ok) {
      let errorMessage = `프로필 수정 실패: ${response.status}`;
      try {
        const errorData = (await response.json()) as { message?: string; error?: boolean };
        errorMessage = errorData.message || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const body = (await response.json()) as { error?: boolean; message?: string };
    if (body.error === true) {
      throw new Error(body.message || "프로필 수정에 실패했습니다.");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("프로필 수정 중 네트워크 오류가 발생했습니다.");
  }
};
