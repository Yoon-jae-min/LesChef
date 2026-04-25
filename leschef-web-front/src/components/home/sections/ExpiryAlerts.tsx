/**
 * 유통기한 임박 알림 섹션 컴포넌트
 * 만료, 긴급, 경고, 알림 상태의 식재료를 표시
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useId, useMemo } from "react";
import useSWR from "swr";
import { fetchExpiryAlerts, type ExpiryAlertResponse } from "@/utils/api/foods";
import { TIMING } from "@/constants/system/timing";
import ErrorMessage from "@/components/common/ui/ErrorMessage";
import { resolveBackendAssetUrl } from "@/utils/helpers/imageUtils";

interface ExpiryAlertsProps {
  isLoggedIn?: boolean;
  authLoading?: boolean;
}

export default function ExpiryAlerts({ isLoggedIn = false, authLoading = false }: ExpiryAlertsProps) {
  const sectionTitleId = useId();
  const { data, error, isLoading } = useSWR<ExpiryAlertResponse>(
    isLoggedIn ? "/foods/expiry-alerts" : null,
    () => fetchExpiryAlerts("all"),
    {
      dedupingInterval: TIMING.FIVE_MINUTES,
      revalidateOnFocus: false,
    }
  );

  // 메모이제이션으로 불필요한 재계산 방지
  // ⚠️ 중요: 모든 Hook은 early return 전에 호출해야 함
  const alerts = data;
  const hasAlerts = useMemo(() => {
    return (
      alerts &&
      (alerts.expiredCount > 0 ||
        alerts.urgentCount > 0 ||
        alerts.warningCount > 0 ||
        alerts.noticeCount > 0)
    );
  }, [alerts]);

  // 우선순위 알림 목록 메모이제이션
  const priorityAlerts = useMemo(() => {
    if (!alerts || !hasAlerts) return [];

    // 우선순위: 만료 > 긴급 > 경고 > 알림
    return [
      ...(alerts.expired || []).map((item) => ({ ...item, priority: "expired" as const })),
      ...(alerts.urgent || []).map((item) => ({ ...item, priority: "urgent" as const })),
      ...(alerts.warning || []).map((item) => ({ ...item, priority: "warning" as const })),
      ...(alerts.notice || []).map((item) => ({ ...item, priority: "notice" as const })),
    ].slice(0, 6); // 최대 6개만 표시
  }, [alerts, hasAlerts]);

  // 인증 확인 중에는 "로그인하세요"를 먼저 보여주지 않고, 섹션 스켈레톤으로 대기
  if (authLoading) {
    return (
      <section
        className="py-8"
        aria-labelledby={sectionTitleId}
        aria-busy="true"
        aria-live="polite"
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 id={sectionTitleId} className="text-2xl font-bold text-gray-900 mb-4">
            유통기한 알림
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-4 animate-pulse h-32"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!isLoggedIn) {
    return (
      <section className="py-8" aria-labelledby={sectionTitleId}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 id={sectionTitleId} className="text-2xl font-bold text-gray-900 mb-4">
            유통기한 알림
          </h2>
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-600 mb-4">로그인하시면 식재료의 유통기한을 관리해드려요!</p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-2xl hover:bg-orange-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              로그인하기
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8" aria-labelledby={sectionTitleId}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 id={sectionTitleId} className="text-2xl font-bold text-gray-900 mb-4">
            유통기한 알림
          </h2>
          <ErrorMessage error={error} showDetails={false} showAction={false} />
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section
        className="py-8"
        aria-labelledby={sectionTitleId}
        aria-busy="true"
        aria-live="polite"
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 id={sectionTitleId} className="text-2xl font-bold text-gray-900 mb-4">
            유통기한 알림
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-4 animate-pulse h-32"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!hasAlerts) {
    return (
      <section className="py-8" aria-labelledby={sectionTitleId}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 id={sectionTitleId} className="text-2xl font-bold text-gray-900 mb-4">
            유통기한 알림
          </h2>
          <div className="rounded-3xl border border-gray-200 bg-green-50 p-6 text-center">
            <p className="text-gray-600">
              유통기한이 임박한 식재료가 없습니다.{" "}
              <span aria-hidden>
                🎉
              </span>
            </p>
          </div>
        </div>
      </section>
    );
  }

  const getPriorityStyle = (priority: "expired" | "urgent" | "warning" | "notice") => {
    switch (priority) {
      case "expired":
        return "bg-red-50 border-red-200 text-red-900";
      case "urgent":
        return "bg-orange-50 border-orange-200 text-orange-900";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-900";
      case "notice":
        return "bg-blue-50 border-blue-200 text-blue-900";
    }
  };

  const getPriorityLabel = (priority: "expired" | "urgent" | "warning" | "notice") => {
    switch (priority) {
      case "expired":
        return "만료";
      case "urgent":
        return "긴급";
      case "warning":
        return "경고";
      case "notice":
        return "알림";
    }
  };

  return (
    <section className="py-8" aria-labelledby={sectionTitleId}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 id={sectionTitleId} className="text-2xl font-bold text-gray-900">
            유통기한 알림
          </h2>
          <Link
            href="/myPage/storage"
            className="text-sm text-orange-600 font-medium hover:text-orange-700 transition-colors flex items-center gap-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            전체보기
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {priorityAlerts.map((alert, index) => {
            const daysUntilExpiry = alert.food.daysUntilExpiry ?? 0;
            const title = alert.food.name?.trim() || "이름 없음";
            const imgSrc = alert.food.imageUrl
              ? resolveBackendAssetUrl(alert.food.imageUrl)
              : "";
            return (
              <div
                key={`${alert.food._id}-${index}`}
                className={`rounded-2xl border p-4 ${getPriorityStyle(alert.priority)}`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-current/20 bg-white/40">
                    {imgSrc ? (
                      <Image src={imgSrc} alt={title} fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-gray-500">
                        사진 없음
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/50">
                        {getPriorityLabel(alert.priority)}
                      </span>
                      <span className="text-xs text-gray-600">{alert.place}</span>
                    </div>
                    <h3 className="font-semibold text-lg truncate">{title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {alert.food.volume} {alert.food.unit}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-current/20">
                  <p className="text-sm font-medium">
                    {daysUntilExpiry < 0
                      ? `만료됨 (${Math.abs(daysUntilExpiry)}일 전)`
                      : daysUntilExpiry === 0
                        ? "오늘 만료"
                        : `D-${daysUntilExpiry}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {alerts && alerts.totalCount > 6 && (
          <div className="mt-4 text-center">
            <Link
              href="/myPage/storage"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
            >
              외 {alerts.totalCount - 6}개의 알림 더보기
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
