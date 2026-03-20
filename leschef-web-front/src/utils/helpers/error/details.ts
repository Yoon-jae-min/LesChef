/**
 * 에러 상세 정보 추출 함수
 */

import type { ApiError } from "./types";

/**
 * 에러에서 필드별 상세 정보 추출
 * @param error 에러 객체
 * @returns 필드별 상세 정보 배열
 */
export function getErrorDetails(error: ApiError | Error | unknown): Array<{
  field: string;
  fieldName: string;
  message: string;
}> {
  if (typeof error === "object" && error !== null && "error" in error) {
    const apiError = error as ApiError;

    if (apiError.details && Array.isArray(apiError.details)) {
      return apiError.details
        .filter(
          (
            detail
          ): detail is { field: string; fieldName?: string; message: string; value?: unknown } =>
            typeof detail === "object" && "field" in detail && "message" in detail
        )
        .map((detail) => ({
          field: detail.field,
          fieldName: detail.fieldName || detail.field,
          message: detail.message,
        }));
    }
  }

  return [];
}
