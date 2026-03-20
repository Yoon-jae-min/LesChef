/**
 * 알림 설정 유틸리티
 * 로컬 스토리지에 알림 설정 저장 및 불러오기
 */

import { STORAGE_KEYS } from "@/constants/storage/storageKeys";

export interface NotificationSettings {
  enabled: boolean;
  showExpired: boolean;
  showUrgent: boolean; // 1일 전
  showWarning: boolean; // 3일 전
  showNotice: boolean; // 7일 전
  autoClose: boolean;
  autoCloseDuration: number; // ms
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  showExpired: true,
  showUrgent: true,
  showWarning: true,
  showNotice: false,
  autoClose: true,
  autoCloseDuration: 5000, // 5초
};

const SETTINGS_KEY = STORAGE_KEYS.NOTIFICATION_SETTINGS || "notification-settings";

/**
 * 알림 설정 불러오기
 */
export function getNotificationSettings(): NotificationSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 기본값과 병합하여 누락된 필드 보완
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.error("알림 설정 불러오기 실패:", error);
  }

  return DEFAULT_SETTINGS;
}

/**
 * 알림 설정 저장하기
 */
export function saveNotificationSettings(settings: Partial<NotificationSettings>): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const current = getNotificationSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("알림 설정 저장 실패:", error);
  }
}

/**
 * 알림 설정 초기화
 */
export function resetNotificationSettings(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error("알림 설정 초기화 실패:", error);
  }
}
