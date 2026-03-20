"use client";

import { useEffect, useRef } from "react";
import { getUserSafeErrorMessage, navigateAfterFailure } from "@/utils/helpers/actionFailure";

/**
 * 세그먼트 트리에서 처리되지 않은 오류 시
 * 기술 메시지 대신 안내 후 이전 페이지(또는 홈)로 이동
 */
export default function AppError({
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
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2 px-6 text-center text-sm text-gray-500">
      <p>화면을 불러오는 중 문제가 발생했습니다.</p>
      <p className="text-xs text-gray-400">잠시 후 이전 화면으로 돌아갑니다.</p>
    </div>
  );
}
