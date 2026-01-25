/**
 * Storage 키 상수
 * localStorage와 sessionStorage에서 사용하는 키를 중앙 관리
 */

export const STORAGE_KEYS = {
  IS_LOGGED_IN: "leschef_is_logged_in",
  CURRENT_USER: "leschef_current_user",
  RETURN_TO: "leschef_return_to",
  FROM_SOURCE: "leschef_from_source",
  NOTIFICATION_SETTINGS: "leschef_notification_settings",
} as const;

