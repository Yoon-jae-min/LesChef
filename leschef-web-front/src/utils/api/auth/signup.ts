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
  const { id, email, pwd, name, nickName, tel } = data;

  if (!id || !email || !pwd || !nickName) {
    throw new Error("아이디, 이메일, 비밀번호, 닉네임은 필수입니다.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        email,
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

    const bodyText = await response.text();
    if (!response.ok) {
      let errorMessage = `아이디 중복 확인 실패: ${response.status}`;
      try {
        const errJson = JSON.parse(bodyText) as { message?: string };
        if (errJson.message) errorMessage = errJson.message;
      } catch {
        if (bodyText) errorMessage = bodyText;
      }
      throw new Error(errorMessage);
    }

    return bodyText;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("아이디 중복 확인 중 네트워크 오류가 발생했습니다.");
  }
};

/**
 * 이메일 인증 코드 발송
 * @param email 이메일 주소
 * @returns Promise<Response>
 */
export const sendVerificationCode = async (email: string): Promise<Response> => {
  if (!email) {
    throw new Error("이메일을 입력해주세요.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/sendVerificationCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      credentials: "include",
    });

    if (!response.ok) {
      let errorMessage = `인증 코드 발송 실패: ${response.status}`;
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
    throw new Error("인증 코드 발송 중 네트워크 오류가 발생했습니다.");
  }
};

/**
 * 이메일 인증 코드 검증
 * @param email 이메일 주소
 * @param code 인증 코드
 * @returns Promise<Response>
 */
export const verifyEmailCode = async (email: string, code: string): Promise<Response> => {
  if (!email || !code) {
    throw new Error("이메일과 인증 코드를 입력해주세요.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/verifyEmailCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
      credentials: "include",
    });

    if (!response.ok) {
      let errorMessage = `인증 코드 검증 실패: ${response.status}`;
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
    throw new Error("인증 코드 검증 중 네트워크 오류가 발생했습니다.");
  }
};
