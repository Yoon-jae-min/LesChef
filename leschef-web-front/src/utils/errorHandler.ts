/**
 * 에러 처리 유틸리티 함수
 * 통일된 에러 처리 패턴 제공
 */

/**
 * 에러 타입 정의
 */
export interface AppError {
  message: string;
  code?: string;
  status?: number;
  originalError?: unknown;
}

/**
 * 에러를 AppError로 변환
 * @param error - 에러 객체 또는 문자열
 * @returns AppError 객체
 */
export const normalizeError = (error: unknown): AppError => {
  if (error instanceof Error) {
    return {
      message: error.message,
      originalError: error,
    };
  }

  if (typeof error === "string") {
    return {
      message: error,
    };
  }

  if (error && typeof error === "object" && "message" in error) {
    return {
      message: String(error.message),
      code: "code" in error ? String(error.code) : undefined,
      status: "status" in error ? Number(error.status) : undefined,
      originalError: error,
    };
  }

  return {
    message: "알 수 없는 오류가 발생했습니다.",
    originalError: error,
  };
};

/**
 * 사용자 친화적인 에러 메시지 반환
 * @param error - 에러 객체
 * @param defaultMessage - 기본 메시지
 * @returns 사용자 친화적인 메시지
 */
export const getUserFriendlyMessage = (
  error: unknown,
  defaultMessage = "오류가 발생했습니다."
): string => {
  const appError = normalizeError(error);

  // 서버 에러 코드에 따른 메시지 매핑
  if (appError.status) {
    switch (appError.status) {
      case 401:
        return "로그인이 필요합니다.";
      case 403:
        return "권한이 없습니다.";
      case 404:
        return "요청한 리소스를 찾을 수 없습니다.";
      case 500:
        return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      default:
        return appError.message || defaultMessage;
    }
  }

  return appError.message || defaultMessage;
};

/**
 * 콘솔에 에러 로그 출력 (개발 환경)
 * @param error - 에러 객체
 * @param context - 에러 발생 컨텍스트
 */
export const logError = (error: unknown, context?: string): void => {
  const appError = normalizeError(error);

  if (process.env.NODE_ENV === "development") {
    console.error(`[Error${context ? ` - ${context}` : ""}]`, {
      message: appError.message,
      code: appError.code,
      status: appError.status,
      originalError: appError.originalError,
    });
  }
};

/**
 * 에러 처리 및 사용자 알림
 * @param error - 에러 객체
 * @param context - 에러 발생 컨텍스트
 * @param showAlert - 사용자에게 알림 표시 여부
 * @returns 사용자 친화적인 메시지
 */
export const handleError = (
  error: unknown,
  context?: string,
  showAlert = true
): string => {
  const message = getUserFriendlyMessage(error);
  
  // 로그 출력
  logError(error, context);

  // 사용자 알림 (선택적)
  if (showAlert && typeof window !== "undefined") {
    alert(message);
  }

  return message;
};

