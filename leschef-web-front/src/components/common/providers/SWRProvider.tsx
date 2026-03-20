"use client";

import { SWRConfig } from "swr";
import { TIMING } from "@/constants/system/timing";

/**
 * SWR 전역 설정 Provider
 * 모든 SWR 호출에 적용되는 기본 설정
 */
export default function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        // 전역 fetcher 설정 (필요시 사용)
        // fetcher: fetcher,

        // 전역 기본 옵션
        revalidateOnFocus: true, // 포커스 시 재검증 (새 데이터 확인)
        revalidateOnReconnect: true, // 네트워크 재연결 시 재검증
        refreshInterval: 0, // 자동 새로고침 비활성화 (수동으로만)
        dedupingInterval: TIMING.ONE_MINUTE, // 기본 1분 동안 중복 요청 방지

        // 에러 재시도 설정
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
          // 429 (Too Many Requests)나 4xx 에러는 재시도하지 않음
          if (error.status === 429 || (error.status >= 400 && error.status < 500)) {
            return;
          }

          // 최대 3회까지만 재시도
          if (retryCount >= 3) {
            return;
          }

          // 지수 백오프: 1초, 2초, 4초 후 재시도
          const timeout = Math.min(1000 * 2 ** retryCount, 10000);

          setTimeout(() => {
            revalidate({ retryCount });
          }, timeout);
        },

        // 전역 에러 핸들링 (선택사항)
        onError: (error, key) => {
          // 전역 에러 로깅 (개발 환경에서만)
          if (process.env.NODE_ENV === "development") {
            console.error("SWR Error:", error, "Key:", key);
          }

          // 401 (Unauthorized)나 403 (Forbidden) 에러는 로그인 페이지로 리다이렉트 가능
          // if (error.status === 401 || error.status === 403) {
          //   window.location.href = "/login";
          // }
        },

        // 에러 상태에서도 캐시된 데이터 사용
        keepPreviousData: true,
      }}
    >
      {children}
    </SWRConfig>
  );
}
