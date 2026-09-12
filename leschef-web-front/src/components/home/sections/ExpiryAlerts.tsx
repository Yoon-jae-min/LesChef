/**
 * 유통기한 임박 알림 섹션
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
  /** 홈 3열 레이아웃용 — 바깥 패딩/max-width 제거, 카드 수 축소 */
  embedded?: boolean;
}

export default function ExpiryAlerts({
  isLoggedIn = false,
  authLoading = false,
  embedded = false,
}: ExpiryAlertsProps) {
  const sectionTitleId = useId();
  const { data, error, isLoading } = useSWR<ExpiryAlertResponse>(
    isLoggedIn ? "/foods/expiry-alerts" : null,
    () => fetchExpiryAlerts("all"),
    {
      dedupingInterval: TIMING.FIVE_MINUTES,
      revalidateOnFocus: false,
    }
  );

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

  const maxItems = embedded ? 2 : 6;

  const priorityAlerts = useMemo(() => {
    if (!alerts || !hasAlerts) return [];

    return [
      ...(alerts.expired || []).map((item) => ({ ...item, priority: "expired" as const })),
      ...(alerts.urgent || []).map((item) => ({ ...item, priority: "urgent" as const })),
      ...(alerts.warning || []).map((item) => ({ ...item, priority: "warning" as const })),
      ...(alerts.notice || []).map((item) => ({ ...item, priority: "notice" as const })),
    ].slice(0, maxItems);
  }, [alerts, hasAlerts, maxItems]);

  const sectionClass = embedded ? "py-0" : "py-8";
  const innerClass = embedded ? "" : "max-w-7xl mx-auto px-6";
  const titleClass = embedded
    ? "text-xl font-bold text-gray-900"
    : "text-2xl font-bold text-gray-900 mb-4";

  const wrap = (children: React.ReactNode, busy?: boolean) => (
    <section
      className={sectionClass}
      aria-labelledby={sectionTitleId}
      {...(busy ? { "aria-busy": true as const, "aria-live": "polite" as const } : {})}
    >
      <div className={innerClass}>{children}</div>
    </section>
  );

  if (authLoading) {
    return wrap(
      <>
        <h2 id={sectionTitleId} className={titleClass}>
          유통기한 알림
        </h2>
        <div className={`grid gap-3 ${embedded ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3 gap-4"}`}>
          {Array.from({ length: embedded ? 2 : 6 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl border border-gray-200 bg-gray-50"
            />
          ))}
        </div>
      </>,
      true
    );
  }

  if (!isLoggedIn) {
    return wrap(
      <>
        <h2 id={sectionTitleId} className={titleClass}>
          유통기한 알림
        </h2>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center">
          <p className="mb-3 text-sm text-gray-600">
            로그인하시면 식재료의 유통기한을 관리해드려요!
          </p>
          <Link
            href="/login"
            className="inline-block rounded-2xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            로그인하기
          </Link>
        </div>
      </>
    );
  }

  if (error) {
    return wrap(
      <>
        <h2 id={sectionTitleId} className={titleClass}>
          유통기한 알림
        </h2>
        <ErrorMessage error={error} showDetails={false} showAction={false} />
      </>
    );
  }

  if (isLoading) {
    return wrap(
      <>
        <h2 id={sectionTitleId} className={titleClass}>
          유통기한 알림
        </h2>
        <div className={`grid gap-3 ${embedded ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3 gap-4"}`}>
          {Array.from({ length: embedded ? 2 : 6 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl border border-gray-200 bg-gray-50"
            />
          ))}
        </div>
      </>,
      true
    );
  }

  if (!hasAlerts) {
    return wrap(
      <>
        <h2 id={sectionTitleId} className={titleClass}>
          유통기한 알림
        </h2>
        <div className="rounded-2xl border border-gray-200 bg-green-50 p-5 text-center">
          <p className="text-sm text-gray-600">유통기한이 임박한 식재료가 없습니다.</p>
        </div>
      </>
    );
  }

  const getPriorityStyle = (priority: "expired" | "urgent" | "warning" | "notice") => {
    switch (priority) {
      case "expired":
        return "bg-red-50 border-red-200 text-red-900";
      case "urgent":
        return "bg-amber-50 border-amber-200 text-amber-900";
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

  const expiryText = (daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) return `만료됨 (${Math.abs(daysUntilExpiry)}일 전)`;
    if (daysUntilExpiry === 0) return "오늘 만료";
    if (daysUntilExpiry <= 3) return `유통기한 ${daysUntilExpiry}일 전`;
    if (daysUntilExpiry <= 7) return "유통기한 1주일 전";
    return `D-${daysUntilExpiry}`;
  };

  return wrap(
    <>
      <div className={`flex items-center justify-between gap-2 ${embedded ? "mb-3" : "mb-4"}`}>
        <h2 id={sectionTitleId} className={embedded ? titleClass : "text-2xl font-bold text-gray-900"}>
          유통기한 알림
        </h2>
        <Link
          href="/myPage/storage"
          className="shrink-0 rounded-lg text-sm font-medium text-green-600 transition-colors hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        >
          전체보기
        </Link>
      </div>

      <div
        className={
          embedded
            ? "grid grid-cols-1 gap-3"
            : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {priorityAlerts.map((alert, index) => {
          const daysUntilExpiry = alert.food.daysUntilExpiry ?? 0;
          const title = alert.food.name?.trim() || "이름 없음";
          const imgSrc = alert.food.imageUrl
            ? resolveBackendAssetUrl(alert.food.imageUrl)
            : "";
          return (
            <div
              key={`${alert.food._id}-${index}`}
              className={`rounded-2xl border p-3.5 ${getPriorityStyle(alert.priority)}`}
            >
              <div className="mb-2 flex items-start gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-current/20 bg-white/40">
                  {imgSrc ? (
                    <Image src={imgSrc} alt={title} fill className="object-cover" sizes="56px" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-gray-500">
                      사진 없음
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  {!embedded && (
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white/50 px-2 py-0.5 text-xs font-semibold">
                        {getPriorityLabel(alert.priority)}
                      </span>
                      <span className="text-xs text-gray-600">{alert.place}</span>
                    </div>
                  )}
                  <h3 className={`truncate font-semibold ${embedded ? "text-base" : "text-lg"}`}>
                    {title}
                  </h3>
                  {!embedded && (
                    <p className="mt-1 text-sm text-gray-600">
                      {alert.food.volume} {alert.food.unit}
                    </p>
                  )}
                  {embedded && (
                    <p className="mt-1 text-sm text-gray-600">{expiryText(daysUntilExpiry)}</p>
                  )}
                </div>
              </div>
              {!embedded && (
                <div className="mt-3 border-t border-current/20 pt-3">
                  <p className="text-sm font-medium">{expiryText(daysUntilExpiry)}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!embedded && alerts && alerts.totalCount > 6 && (
        <div className="mt-4 text-center">
          <Link
            href="/myPage/storage"
            className="rounded-lg text-sm text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
          >
            외 {alerts.totalCount - 6}개의 알림 더보기
          </Link>
        </div>
      )}
    </>
  );
}
