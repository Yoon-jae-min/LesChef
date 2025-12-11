/**
 * 인증 API 유틸리티 함수
 * 회원가입, 로그인 등 인증 관련 서버 통신 함수들
 */

// 예시 API 주소 (나중에 실제 주소로 변경)
const API_BASE_URL = "http://localhost:3000/api/customer";

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

  return response;
};

/**
 * 로그인
 * @param data 로그인 데이터
 * @returns Promise<LoginResponse>
 */
export const login = async (data: LoginData): Promise<LoginResponse> => {
  const { customerId, customerPwd } = data;

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
    const errorText = await response.text();
    throw new Error(errorText || `로그인 실패: ${response.status}`);
  }

  const result: LoginResponse = await response.json();
  return result;
};

/**
 * 로그아웃
 * @returns Promise<Response>
 */
export const logout = async (): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: "GET",
    credentials: "include",
  });

  return response;
};

/**
 * 인증 상태 확인
 * @returns Promise<{ loggedIn: boolean }>
 */
export const checkAuth = async (): Promise<{ loggedIn: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/auth`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();
  return result;
};

/**
 * 아이디 중복 확인
 * @param id 확인할 아이디
 * @returns Promise<string> "중복" 또는 "중복 아님"
 */
export const checkIdDuplicate = async (id: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/check?id=${encodeURIComponent(id)}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.text();
  return result;
};

/** 유저 정보 조회 */
export const fetchUserInfo = async (): Promise<UserInfoResponse> => {
  const response = await fetch(`${API_BASE_URL}/info`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `유저 정보 조회 실패: ${response.status}`);
  }

  return response.json();
};

