/**
 * API 에러 핸들러 함수
 * API 응답에서 에러를 추출하고 사용자 친화적인 메시지로 변환
 */

import type { ApiError } from "./types";
import { formatErrorMessage } from "./format";
import { getStatusMessage } from "./actions";

/**
 * API 응답에서 에러 추출 및 변환
 * @param response Fetch Response 객체
 * @returns 사용자 친화적인 에러 메시지
 */
export async function handleApiError(response: Response): Promise<Error> {
  let errorData: ApiError | null = null;

  try {
    errorData = await response.json();
  } catch {
    // JSON 파싱 실패 시 텍스트로 처리
    try {
      const text = await response.text();
      return new Error(text || getStatusMessage(response.status));
    } catch {
      return new Error(getStatusMessage(response.status));
    }
  }

  // API 에러 응답이 있는 경우 사용자 친화적 메시지 사용
  if (errorData && "error" in errorData && errorData.error) {
    return new Error(formatErrorMessage(errorData));
  }

  return new Error(getStatusMessage(response.status));
}
