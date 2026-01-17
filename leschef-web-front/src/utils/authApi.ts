/**
 * 인증 API 유틸리티 함수
 * 회원가입, 로그인 등 인증 관련 서버 통신 함수들
 */

import { API_CONFIG } from "@/config/apiConfig";

const API_BASE_URL = API_CONFIG.CUSTOMER_API;

export type SignupData = {
  id: string; // 이메일 또는 아이디
  pwd: string; // 비밀번호
  name?: string; // 이름 (선택)
  nickName: string; // 닉네임
  tel?: string; // 전화번호 (선택)
};

export type LoginData = {
  customerId: string; // 이메일 또는 아이디
  customerPwd: string; // 비밀번호
};

export type LoginResponse = {
  text: string;
  id: string;
  name: string;
  nickName: string;
  tel: string;
};

export type UserInfoResponse = {
  id: string;
  nickName: string;
  name: string;
  tel: string;
  checkAdmin: boolean;
  text: boolean;
};

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
      credentials: "include", // 세션 쿠키를 포함하기 위해
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

    const result: LoginResponse = await response.json();
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
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "GET",
      credentials: "include",
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

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("로그아웃 중 네트워크 오류가 발생했습니다.");
  }
};

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

/** 유저 정보 조회 */
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

