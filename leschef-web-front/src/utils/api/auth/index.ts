/**
 * 인증 API — UI·훅에서는 `@/utils/api/auth` 만 import 하는 것을 권장합니다.
 */

export type {
  SignupData,
  LoginData,
  LoginResponse,
  UserInfoResponse,
  UpdateUserProfileParams,
} from "./types";

export { signup, checkIdDuplicate, sendVerificationCode, verifyEmailCode } from "./signup";
export { login, logout } from "./login";
export { checkAuth } from "./check";
export {
  fetchUserInfo,
  updateUserProfile,
  verifyPasswordForSession,
  deleteAccount,
  type DeleteAccountParams,
} from "./user";
export { changePassword, type ChangePasswordParams } from "./password";
export { unlinkSocial } from "./socialLink";

export {
  findIdByProfile,
  verifyPasswordReset,
  completePasswordReset,
  type FindIdResponse,
  type VerifyPasswordResetResponse,
} from "./accountRecovery";
