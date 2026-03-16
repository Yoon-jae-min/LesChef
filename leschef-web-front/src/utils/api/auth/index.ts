/**
 * 인증 API 유틸리티 함수
 * 하위 호환성을 위한 인덱스 파일
 * 모든 타입과 함수를 re-export
 */

// 타입 정의
export type {
  SignupData,
  LoginData,
  LoginResponse,
  UserInfoResponse,
} from "./types";

// 회원가입 함수들
export {
  signup,
  checkIdDuplicate,
  sendVerificationCode,
  verifyEmailCode,
} from "./signup";

// 로그인/로그아웃 함수들
export {
  login,
  logout,
} from "./login";

// 인증 확인 함수
export {
  checkAuth,
} from "./check";

// 유저 정보 함수
export {
  fetchUserInfo,
} from "./user";

// SNS 계정 연동 관련 함수
export {
  unlinkSocial,
} from "./socialLink";

