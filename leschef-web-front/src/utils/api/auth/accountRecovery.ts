/**
 * 아이디 찾기 · 비밀번호 재설정 (비로그인)
 */

import { API_CONFIG } from "@/config/apiConfig";

const API_BASE_URL = API_CONFIG.CUSTOMER_API;

export type FindIdResponse = {
  error: false;
  maskedId: string;
};

export type ApiErrorJson = {
  error: true;
  message?: string;
};

async function parseJson<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("서버 응답을 해석할 수 없습니다.");
  }
}

/**
 * 이름 + 전화번호로 등록된 아이디(마스킹) 조회
 */
export async function findIdByProfile(name: string, tel: string): Promise<FindIdResponse> {
  const response = await fetch(`${API_BASE_URL}/findId`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name.trim(), tel: tel.trim() }),
  });

  const data = await parseJson<FindIdResponse | ApiErrorJson>(response);

  if (!response.ok || data.error !== false) {
    const msg =
      (data as ApiErrorJson).message ||
      (response.status === 404
        ? "일치하는 회원 정보가 없습니다."
        : `요청 실패 (${response.status})`);
    throw new Error(msg);
  }

  return data;
}

export type VerifyPasswordResetResponse = {
  error: false;
  resetToken: string;
  expiresInMinutes: number;
};

/**
 * 아이디(이메일) + 이름 + 전화번호 일치 시 재설정용 토큰 발급
 */
export async function verifyPasswordReset(
  id: string,
  name: string,
  tel: string
): Promise<VerifyPasswordResetResponse> {
  const response = await fetch(`${API_BASE_URL}/verifyPasswordReset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: id.trim(),
      name: name.trim(),
      tel: tel.trim(),
    }),
  });

  const data = await parseJson<VerifyPasswordResetResponse | ApiErrorJson>(response);

  if (!response.ok || data.error !== false) {
    const msg =
      (data as ApiErrorJson).message ||
      (response.status === 404
        ? "일치하는 회원 정보가 없습니다."
        : `요청 실패 (${response.status})`);
    throw new Error(msg);
  }

  return data;
}

/**
 * 본인확인 토큰 + 새 비밀번호로 재설정 완료
 */
export async function completePasswordReset(resetToken: string, newPwd: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/resetPassword`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resetToken, newPwd }),
  });

  const data = await parseJson<{ error?: boolean; message?: string }>(response);

  if (!response.ok || data.error !== false || data.message !== "success") {
    throw new Error(data.message || `비밀번호 재설정 실패 (${response.status})`);
  }
}
