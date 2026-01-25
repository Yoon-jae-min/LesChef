/**
 * 에러 처리 유틸리티 함수
 * 하위 호환성을 위한 인덱스 파일
 * 모든 타입과 함수를 re-export
 */

// 타입 정의
export type { ApiError } from "./types";

// 포맷팅 함수들
export {
  formatErrorMessage,
  formatErrorForUser,
} from "./format";

// 상세 정보 함수
export {
  getErrorDetails,
} from "./details";

// 액션 제안 함수들
export {
  getErrorAction,
  getStatusMessage,
} from "./actions";

// 핸들러 함수
export {
  handleApiError,
} from "./handler";

