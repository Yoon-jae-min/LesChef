/**
 * 회원가입 API 함수
 * 회원가입 및 아이디 중복 확인 관련 함수들
 */

import { API_CONFIG } from "@/config/apiConfig";
import type { SignupData } from "./types";

const API_BASE_URL = API_CONFIG.CUSTOMER_API;

/**
 * 회원가입
 * @param data 회원가입 데이터
 * @returns Promise<Response>
 */
export const signup = async (data: SignupData): Promise<Response> => {
  const { id, pwd, name, nickName, tel } = data;

  if (!id || !pwd || !nickName) {
    throw new Error("아이디, 비밀번호, 닉네임은 필수입니다.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        pwd,
        name: name || "user", // 기본값
        nickName,
        tel: tel || "", // 기본값
      }),
      credentials: "include", // 세션 쿠키를 포함하기 위해
    });

    if (!response.ok) {
      let errorMessage = `회원가입 실패: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("회원가입 중 네트워크 오류가 발생했습니다.");
  }
};

/**
 * 아이디 중복 확인
 * @param id 확인할 아이디
 * @returns Promise<string> "중복" 또는 "중복 아님"
 */
export const checkIdDuplicate = async (id: string): Promise<string> => {
  if (!id) {
    throw new Error("아이디를 입력해주세요.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/check?id=${encodeURIComponent(id)}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`아이디 중복 확인 실패: ${response.status}`);
    }

    const result = await response.text();
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("아이디 중복 확인 중 네트워크 오류가 발생했습니다.");
  }
};

