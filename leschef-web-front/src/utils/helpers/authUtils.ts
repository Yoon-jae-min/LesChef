/**
 * 인증 관련 유틸리티 함수
 * 로그인 상태 체크, 사용자 정보 가져오기 등
 */

import { STORAGE_KEYS } from "@/constants/storage/storageKeys";

/**
 * 로컬 스토리지에 저장된 사용자 정보 타입
 */
export type StoredUserInfo = {
  id: string;
  name?: string;
  nickName?: string;
  tel?: string;
  [key: string]: unknown; // 추가 필드 허용
};

/**
 * 로그인 상태 확인
 * @returns 로그인 여부 (boolean)
 */
export const checkLoginStatus = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === "true";
};

/**
 * 현재 로그인한 사용자 정보 가져오기
 * @returns 사용자 정보 객체 또는 null
 */
export const getCurrentUser = (): StoredUserInfo | null => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!userStr) return null;
  
  try {
    const parsed = JSON.parse(userStr) as StoredUserInfo;
    // 최소한 id가 있는지 확인
    if (!parsed.id) return null;
    return parsed;
  } catch {
    return null;
  }
};

/**
 * 사용자 ID 가져오기
 * @returns 사용자 ID 또는 null
 */
export const getCurrentUserId = (): string | null => {
  const user = getCurrentUser();
  return user?.id || null;
};

/**
 * 로그인 상태 초기화 (모든 인증 관련 Storage 제거)
 */
export const clearAuthStorage = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  sessionStorage.removeItem(STORAGE_KEYS.RETURN_TO);
  sessionStorage.removeItem(STORAGE_KEYS.FROM_SOURCE);
};

