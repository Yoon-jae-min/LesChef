/**
 * 에러 메시지 표시 컴포넌트
 * 사용자 친화적인 에러 메시지와 액션 제안을 표시
 */

"use client";

import { formatErrorForUser } from "@/utils/helpers/error";
import type { ApiError } from "@/utils/helpers/error";

interface ErrorMessageProps {
  error: ApiError | Error | unknown;
  className?: string;
  showDetails?: boolean;
  showAction?: boolean;
  onRetry?: () => void;
}

export default function ErrorMessage({
  error,
  className = "",
  showDetails = false,
  showAction = true,
  onRetry,
}: ErrorMessageProps) {
  const { message, details, action } = formatErrorForUser(error);

  return (
    <div
      className={`rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 ${className}`}
      role="alert"
    >
      {/* 메인 에러 메시지 */}
      <div className="flex items-start gap-2">
        <span className="text-lg" aria-hidden="true">
          ⚠️
        </span>
        <div className="flex-1">
          <p className="font-medium">{message}</p>

          {/* 상세 정보 */}
          {showDetails && details.length > 0 && (
            <ul className="mt-2 ml-6 list-disc space-y-1 text-xs">
              {details.map((detail, index) => (
                <li key={index}>
                  <span className="font-medium">{detail.fieldName}:</span> {detail.message}
                </li>
              ))}
            </ul>
          )}

          {/* 액션 제안 */}
          {showAction && action && <p className="mt-2 text-xs text-red-600">{action}</p>}

          {/* 재시도 버튼 */}
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            >
              다시 시도
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 간단한 인라인 에러 메시지 컴포넌트
 */
export function InlineErrorMessage({
  error,
  className = "",
}: {
  error: ApiError | Error | unknown;
  className?: string;
}) {
  const { message } = formatErrorForUser(error);

  return (
    <p className={`text-xs text-red-600 ${className}`} role="alert">
      {message}
    </p>
  );
}
