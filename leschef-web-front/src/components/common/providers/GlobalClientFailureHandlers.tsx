"use client";

import { useEffect } from "react";
import { getUserSafeErrorMessage, reportGlobalFailure } from "@/utils/helpers/actionFailure";

/**
 * 처리되지 않은 Promise 거부·전역 오류 시
 * - 프로덕션: 사용자용 alert + 이전 페이지(또는 홈)로 이동
 * - 개발: 콘솔만 (Next 오버레이·디버깅 유지)
 */
export default function GlobalClientFailureHandlers() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isDev = process.env.NODE_ENV === "development";

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isDev) {
        console.error("[Unhandled rejection]", event.reason);
        return;
      }
      try {
        event.preventDefault();
      } catch {
        /* ignore */
      }
      reportGlobalFailure(getUserSafeErrorMessage(event.reason));
    };

    const onWindowError = (event: ErrorEvent) => {
      if (isDev) {
        console.error("[Window error]", event.error ?? event.message);
        return;
      }
      // 이미지·스크립트 리소스 로드 실패 등은 error 객체 없이 올 수 있음 → 알림 생략
      if (!(event.error instanceof Error)) {
        return;
      }
      event.preventDefault();
      reportGlobalFailure(getUserSafeErrorMessage(event.error));
    };

    window.addEventListener("unhandledrejection", onUnhandledRejection);
    window.addEventListener("error", onWindowError);

    return () => {
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      window.removeEventListener("error", onWindowError);
    };
  }, []);

  return null;
}
