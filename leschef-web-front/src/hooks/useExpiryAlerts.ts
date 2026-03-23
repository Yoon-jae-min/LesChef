/**
 * 유통기한 알림 훅
 * - 토스트: 장소·심각도별 묶음 요약 (이름 미표시)
 * - 알림함: 항목별 상세(썸네일·장소·D-day·이름 있으면 부가) → localStorage
 */

"use client";

import { useEffect, useMemo, useRef } from "react";
import useSWR from "swr";
import { fetchExpiryAlerts, type ExpiryAlertResponse, type FoodItem } from "@/utils/api/foods";
import { useNotification } from "@/contexts/Notification";
import { TIMING } from "@/constants/system/timing";
import { getNotificationSettings, type NotificationSettings } from "@/utils/helpers/notification";
import {
  prependExpiryInboxEntries,
  type ExpiryInboxBucket,
  type ExpiryInboxEntry,
} from "@/utils/helpers/expiryInbox";

const MAX_TOAST_BATCHES = 5;

function placeLabel(place: string): string {
  const p = place.trim();
  return p.length > 0 ? p : "보관함";
}

function bucketEnabled(bucket: ExpiryInboxBucket, settings: NotificationSettings): boolean {
  switch (bucket) {
    case "expired":
      return settings.showExpired;
    case "urgent":
      return settings.showUrgent;
    case "warning":
      return settings.showWarning;
    case "notice":
      return settings.showNotice;
    default:
      return false;
  }
}

function bucketCopy(bucket: ExpiryInboxBucket): { title: string; phrase: string } {
  switch (bucket) {
    case "expired":
      return { title: "유통기한 만료", phrase: "유통기한이 지난 항목이" };
    case "urgent":
      return { title: "만료 임박", phrase: "곧 만료 예정인 항목이" };
    case "warning":
      return { title: "만료 임박", phrase: "만료가 임박한 항목이" };
    case "notice":
      return { title: "유통기한 안내", phrase: "일주일 내 만료 예정인 항목이" };
  }
}

const BUCKET_PRIORITY: Record<ExpiryInboxBucket, number> = {
  expired: 0,
  urgent: 1,
  warning: 2,
  notice: 3,
};

type AlertRow = { place: string; food: FoodItem };

function toInboxEntry(row: AlertRow, bucket: ExpiryInboxBucket): ExpiryInboxEntry {
  const foodId = row.food._id;
  const createdAt = Date.now();
  const suffix = Math.random().toString(36).slice(2, 9);
  const name = row.food.name?.trim() || undefined;
  return {
    id: `${foodId}-${bucket}-${createdAt}-${suffix}`,
    foodId,
    bucket,
    place: row.place,
    daysUntilExpiry: typeof row.food.daysUntilExpiry === "number" ? row.food.daysUntilExpiry : null,
    name,
    imageUrl: row.food.imageUrl?.trim() || undefined,
    createdAt,
  };
}

export function useExpiryAlerts(isLoggedIn: boolean = false) {
  const { addNotification } = useNotification();
  const notifiedIdsRef = useRef<Set<string>>(new Set());
  const lastCheckRef = useRef<number>(0);

  const settings = useMemo(() => getNotificationSettings(), []);

  const { data: alerts } = useSWR<ExpiryAlertResponse>(
    isLoggedIn && settings.enabled ? "/foods/expiry-alerts" : null,
    () => fetchExpiryAlerts("all"),
    {
      dedupingInterval: TIMING.ONE_MINUTE,
      revalidateOnFocus: true,
      refreshInterval: isLoggedIn && settings.enabled ? TIMING.FIVE_MINUTES : 0,
    }
  );

  useEffect(() => {
    if (!alerts || !settings.enabled) return;

    const now = Date.now();
    if (now - lastCheckRef.current < 60000) return;
    lastCheckRef.current = now;

    const buckets: ExpiryInboxBucket[] = ["expired", "urgent", "warning", "notice"];

    type Batch = {
      bucket: ExpiryInboxBucket;
      place: string;
      rows: AlertRow[];
    };

    const batches: Batch[] = [];

    for (const bucket of buckets) {
      if (!bucketEnabled(bucket, settings)) continue;

      const list: AlertRow[] =
        bucket === "expired"
          ? alerts.expired || []
          : bucket === "urgent"
            ? alerts.urgent || []
            : bucket === "warning"
              ? alerts.warning || []
              : alerts.notice || [];

      const fresh = list.filter((row) => {
        const id = row.food._id;
        if (!id) return false;
        return !notifiedIdsRef.current.has(`${bucket}-${id}`);
      });

      if (fresh.length === 0) continue;

      const byPlace = new Map<string, AlertRow[]>();
      for (const row of fresh) {
        const key = placeLabel(row.place);
        const arr = byPlace.get(key) ?? [];
        arr.push(row);
        byPlace.set(key, arr);
      }

      for (const [place, rows] of byPlace.entries()) {
        batches.push({ bucket, place, rows });
      }
    }

    batches.sort((a, b) => {
      const p = BUCKET_PRIORITY[a.bucket] - BUCKET_PRIORITY[b.bucket];
      if (p !== 0) return p;
      return a.place.localeCompare(b.place, "ko");
    });

    if (batches.length === 0) return;

    const inboxEntries: ExpiryInboxEntry[] = [];
    for (const b of batches) {
      for (const row of b.rows) {
        const id = row.food._id;
        if (id) notifiedIdsRef.current.add(`${b.bucket}-${id}`);
        inboxEntries.push(toInboxEntry(row, b.bucket));
      }
    }

    if (inboxEntries.length > 0) {
      prependExpiryInboxEntries(inboxEntries);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("leschef-expiry-inbox-updated"));
      }
    }

    const toastBatches = batches.slice(0, MAX_TOAST_BATCHES);
    for (const b of toastBatches) {
      const { title, phrase } = bucketCopy(b.bucket);
      const count = b.rows.length;
      const label = b.place;
      const message = `「${label}」에 ${phrase} ${count}건 있습니다. 마이페이지 「알림」에서 항목별로 확인할 수 있어요.`;

      addNotification({
        type: b.bucket,
        title,
        message,
        duration: settings.autoClose ? settings.autoCloseDuration : 0,
        action: {
          label: "보관함에서 보기",
          href: "/myPage/storage",
        },
      });
    }

    if (notifiedIdsRef.current.size > 200) {
      notifiedIdsRef.current.clear();
    }
  }, [alerts, settings, addNotification]);

  return {
    alerts,
    hasAlerts:
      alerts &&
      (alerts.expiredCount > 0 ||
        alerts.urgentCount > 0 ||
        alerts.warningCount > 0 ||
        alerts.noticeCount > 0),
  };
}
