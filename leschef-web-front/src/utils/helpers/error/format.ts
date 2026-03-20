/**
 * 에러 메시지 포맷팅 함수
 * API 에러를 사용자 친화적인 메시지로 변환
 */

import type { ApiError } from "./types";
import { getErrorDetails } from "./details";
import { getErrorAction } from "./actions";

/**
 * API 에러 응답을 사용자 친화적인 메시지로 변환
 * @param error 에러 객체
 * @returns 사용자 친화적인 에러 메시지
 */
export function formatErrorMessage(error: ApiError | Error | unknown): string {
  // ApiError 타입인 경우
  if (typeof error === "object" && error !== null && "error" in error) {
    const apiError = error as ApiError;

    // details가 배열인 경우 첫 번째 메시지 사용
    if (apiError.details && Array.isArray(apiError.details) && apiError.details.length > 0) {
      const firstDetail = apiError.details[0];
      if (typeof firstDetail === "object" && "message" in firstDetail) {
        return firstDetail.message;
      }
    }

    // fieldName이 있으면 더 구체적인 메시지 생성
    if (apiError.fieldName && apiError.message) {
      return apiError.message;
    }

    return apiError.message || "오류가 발생했습니다.";
  }

  // 일반 Error 객체인 경우
  if (error instanceof Error) {
    return error.message || "오류가 발생했습니다.";
  }

  // 알 수 없는 에러
  return "알 수 없는 오류가 발생했습니다.";
}

/**
 * 에러를 사용자 친화적인 형태로 변환
 * @param error 에러 객체
 * @returns 사용자 친화적인 에러 정보 객체
 */
export function formatErrorForUser(error: ApiError | Error | unknown): {
  message: string;
  details: Array<{ field: string; fieldName: string; message: string }>;
  action: string | null;
} {
  return {
    message: formatErrorMessage(error),
    details: getErrorDetails(error),
    action: getErrorAction(error),
  };
}
