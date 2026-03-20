"use client";

import { useEffect, useRef } from "react";
import "./globals.css";
import { getUserSafeErrorMessage, navigateAfterFailure } from "@/utils/helpers/actionFailure";

/**
 * 루트 레이아웃까지 깨질 때 — 반드시 html/body 포함
 */
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    if (typeof window !== "undefined") {
      window.alert(getUserSafeErrorMessage(error));
      navigateAfterFailure("back");
    }
  }, [error]);

  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col items-center justify-center gap-2 bg-white px-6 text-center text-sm text-gray-600">
        <p>앱을 불러오는 중 문제가 발생했습니다.</p>
        <p className="text-xs text-gray-400">잠시 후 이전 화면으로 돌아갑니다.</p>
      </body>
    </html>
  );
}
