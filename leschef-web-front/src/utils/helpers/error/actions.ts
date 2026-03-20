/**
 * 에러 액션 제안 함수
 * 에러 타입에 따른 사용자 액션 제안 및 HTTP 상태 코드 메시지
 */

import type { ApiError } from "./types";

/**
 * 에러 타입에 따른 사용자 액션 제안
 * @param error 에러 객체
 * @returns 액션 제안 메시지 또는 null
 */
export function getErrorAction(error: ApiError | Error | unknown): string | null {
  if (typeof error === "object" && error !== null && "error" in error) {
    const apiError = error as ApiError;
    const message = apiError.message.toLowerCase();

    // 인증 관련 에러
    if (message.includes("로그인") || message.includes("인증")) {
      return "다시 로그인해주세요.";
    }

    // 권한 관련 에러
    if (message.includes("권한") || message.includes("접근")) {
      return "접근 권한이 없습니다. 관리자에게 문의해주세요.";
    }

    // 파일 크기 에러
    if (message.includes("크기") || apiError.maxSizeMB) {
      return `파일 크기를 ${apiError.maxSizeMB || 10}MB 이하로 줄여주세요.`;
    }

    // 파일 개수 에러
    if (message.includes("개수") || apiError.maxCount) {
      return `파일 개수를 ${apiError.maxCount || 10}개 이하로 줄여주세요.`;
    }

    // 네트워크 에러
    if (message.includes("네트워크") || message.includes("연결")) {
      return "인터넷 연결을 확인하고 다시 시도해주세요.";
    }

    // 데이터베이스 에러
    if (message.includes("데이터베이스") || message.includes("db")) {
      return "잠시 후 다시 시도해주세요.";
    }

    // 중복 데이터 에러
    if (message.includes("이미") || message.includes("존재")) {
      return "다른 값을 입력해주세요.";
    }
  }

  return null;
}

/**
 * HTTP 상태 코드에 따른 기본 메시지
 * @param status HTTP 상태 코드
 * @returns 상태 코드에 해당하는 메시지
 */
export function getStatusMessage(status: number): string {
  const messages: Record<number, string> = {
    400: "잘못된 요청입니다.",
    401: "로그인이 필요합니다.",
    403: "접근 권한이 없습니다.",
    404: "요청한 정보를 찾을 수 없습니다.",
    409: "이미 존재하는 정보입니다.",
    413: "요청 크기가 너무 큽니다.",
    422: "처리할 수 없는 요청입니다.",
    429: "요청 횟수가 너무 많습니다. 잠시 후 다시 시도해주세요.",
    500: "서버 오류가 발생했습니다.",
    503: "서비스를 일시적으로 사용할 수 없습니다.",
  };

  return messages[status] || "오류가 발생했습니다.";
}
