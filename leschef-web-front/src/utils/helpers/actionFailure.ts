/**
 * 작업 실패 시 사용자에게 alert + 안전한 이동(뒤로/지정 경로)
 * 기술적인 스택·digest는 노출하지 않음
 */

export const DEFAULT_FAILURE_MESSAGE =
  "작업을 처리하는 중 문제가 발생했습니다. 이전 화면으로 돌아갑니다.";

const MAX_MESSAGE_LENGTH = 280;

/** 연속 전역 실패 처리 방지 (루프·중복 alert) */
let globalFailureLockUntil = 0;
const GLOBAL_FAILURE_COOLDOWN_MS = 1500;

function isGlobalFailureLocked(): boolean {
  return Date.now() < globalFailureLockUntil;
}

function lockGlobalFailureBriefly(): void {
  globalFailureLockUntil = Date.now() + GLOBAL_FAILURE_COOLDOWN_MS;
}

/**
 * Error / unknown → 사용자에게 보여줄 짧은 문장 (스택·digest 제거)
 */
export function getUserSafeErrorMessage(error: unknown): string {
  if (error === null || error === undefined) {
    return DEFAULT_FAILURE_MESSAGE;
  }

  if (typeof error === "string") {
    const t = error.trim();
    return t.length > 0 ? truncateMessage(sanitizeOneLine(t)) : DEFAULT_FAILURE_MESSAGE;
  }

  if (error instanceof Error && error.message) {
    return truncateMessage(sanitizeOneLine(error.message));
  }

  return DEFAULT_FAILURE_MESSAGE;
}

function sanitizeOneLine(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/[\r\n]+/g, " ")
    .trim();
}

function truncateMessage(text: string): string {
  if (text.length <= MAX_MESSAGE_LENGTH) return text;
  return `${text.slice(0, MAX_MESSAGE_LENGTH)}…`;
}

/**
 * alert 후 이동 (Next 라우터 없이도 동작 — 전역 핸들러용)
 * @param redirect `"back"` = 히스토리 있으면 뒤로, 없으면 홈. 그 외는 절대 경로(`/path`) 권장
 */
export function navigateAfterFailure(redirect: string = "back"): void {
  if (typeof window === "undefined") return;

  if (redirect === "back") {
    try {
      if (window.history.length > 1) {
        window.history.back();
        return;
      }
    } catch {
      /* ignore */
    }
    window.location.assign("/");
    return;
  }

  const path = redirect.startsWith("/") ? redirect : `/${redirect}`;
  window.location.assign(path);
}

export type ReportActionFailureOptions = {
  /** 사용자 정의 문구 (없으면 error에서 추출) */
  message?: string;
  /** 기본 `"back"` — 또는 `"/path"` */
  redirect?: string;
};

/**
 * catch 블록 등에서 호출: alert → 이동
 */
export function reportActionFailure(error: unknown, options?: ReportActionFailureOptions): void {
  const message = options?.message ?? getUserSafeErrorMessage(error);
  const redirect = options?.redirect ?? "back";

  if (typeof window !== "undefined") {
    window.alert(message);
    navigateAfterFailure(redirect);
  }
}

/**
 * 전역 미처리 오류용: 짧은 쿨다운으로 중복 방지
 */
export function reportGlobalFailure(message?: string): void {
  if (typeof window === "undefined") return;
  if (isGlobalFailureLocked()) return;

  lockGlobalFailureBriefly();
  window.alert(
    message?.trim() ? truncateMessage(sanitizeOneLine(message)) : DEFAULT_FAILURE_MESSAGE
  );
  navigateAfterFailure("back");
}
