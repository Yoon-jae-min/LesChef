/**
 * 비밀번호 변경 API
 */

import { API_CONFIG } from "@/config/apiConfig";

const API_BASE_URL = API_CONFIG.CUSTOMER_API;

export type ChangePasswordParams = {
  currentPwd: string;
  newPwd: string;
};

/**
 * 로그인 세션 기준 비밀번호 변경
 * @throws Error 서버 메시지 또는 네트워크 오류
 */
export async function changePassword(params: ChangePasswordParams): Promise<void> {
  const { currentPwd, newPwd } = params;

  const response = await fetch(`${API_BASE_URL}/pwdChg`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ currentPwd, newPwd }),
  });

  let data: { error?: boolean; message?: string } = {};
  try {
    data = (await response.json()) as typeof data;
  } catch {
    /* ignore */
  }

  if (!response.ok) {
    throw new Error(data.message || `비밀번호 변경 실패 (${response.status})`);
  }

  if (data.error !== false || data.message !== "success") {
    throw new Error(data.message || "비밀번호 변경에 실패했습니다.");
  }
}
