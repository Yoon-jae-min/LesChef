/**
 * 유통기한 알림 훅
 * 유통기한 데이터를 모니터링하고 알림을 표시
 */

"use client";

import { useEffect, useMemo, useRef } from "react";
import useSWR from "swr";
import { fetchExpiryAlerts, type ExpiryAlertResponse } from "@/utils/api/foods";
import { useNotification } from "@/contexts/Notification";
import { TIMING } from "@/constants/system/timing";
import { getNotificationSettings, type NotificationSettings } from "@/utils/helpers/notification";

export function useExpiryAlerts(isLoggedIn: boolean = false) {
  const { addNotification } = useNotification();
  const notifiedIdsRef = useRef<Set<string>>(new Set());
  const lastCheckRef = useRef<number>(0);

  // 알림 설정 불러오기
  const settings = useMemo(() => getNotificationSettings(), []);

  // 유통기한 알림 데이터 가져오기
  const { data: alerts } = useSWR<ExpiryAlertResponse>(
    isLoggedIn && settings.enabled ? "/foods/expiry-alerts" : null,
    () => fetchExpiryAlerts("all"),
    {
      dedupingInterval: TIMING.ONE_MINUTE,
      revalidateOnFocus: true,
      refreshInterval: isLoggedIn && settings.enabled ? TIMING.FIVE_MINUTES : 0,
    }
  );

  // 알림 표시 로직
  useEffect(() => {
    if (!alerts || !settings.enabled) return;

    const now = Date.now();
    // 최소 1분 간격으로 알림 체크 (중복 방지)
    if (now - lastCheckRef.current < 60000) return;
    lastCheckRef.current = now;

    const newNotifications: Array<{
      foodId: string;
      type: "expired" | "urgent" | "warning" | "notice";
      title: string;
      message: string;
    }> = [];

    // 만료 알림
    if (settings.showExpired && alerts.expired && alerts.expired.length > 0) {
      alerts.expired.forEach((item) => {
        const foodId = item.food._id;
        if (!notifiedIdsRef.current.has(`expired-${foodId}`)) {
          newNotifications.push({
            foodId,
            type: "expired",
            title: "식재료 만료 알림",
            message: `${item.food.name} (${item.place})이(가) 만료되었습니다.`,
          });
          notifiedIdsRef.current.add(`expired-${foodId}`);
        }
      });
    }

    // 긴급 알림 (1일 전)
    if (settings.showUrgent && alerts.urgent && alerts.urgent.length > 0) {
      alerts.urgent.forEach((item) => {
        const foodId = item.food._id;
        const days = item.food.daysUntilExpiry ?? 0;
        if (!notifiedIdsRef.current.has(`urgent-${foodId}`) && days <= 1) {
          newNotifications.push({
            foodId,
            type: "urgent",
            title: "유통기한 임박 알림 (1일 전)",
            message: `${item.food.name} (${item.place})이(가) 내일 만료됩니다.`,
          });
          notifiedIdsRef.current.add(`urgent-${foodId}`);
        }
      });
    }

    // 경고 알림 (3일 전)
    if (settings.showWarning && alerts.warning && alerts.warning.length > 0) {
      alerts.warning.forEach((item) => {
        const foodId = item.food._id;
        const days = item.food.daysUntilExpiry ?? 0;
        if (!notifiedIdsRef.current.has(`warning-${foodId}`) && days <= 3 && days > 1) {
          newNotifications.push({
            foodId,
            type: "warning",
            title: "유통기한 임박 알림 (3일 전)",
            message: `${item.food.name} (${item.place})이(가) ${days}일 후 만료됩니다.`,
          });
          notifiedIdsRef.current.add(`warning-${foodId}`);
        }
      });
    }

    // 알림 표시 (배치로 처리하여 성능 최적화)
    if (newNotifications.length > 0) {
      // 최대 3개까지만 동시에 표시 (사용자 경험 개선)
      const notificationsToShow = newNotifications.slice(0, 3);
      notificationsToShow.forEach((notif) => {
        addNotification({
          type: notif.type,
          title: notif.title,
          message: notif.message,
          duration: settings.autoClose ? settings.autoCloseDuration : 0,
          action: {
            label: "식재료 관리",
            href: "/myPage/storage",
          },
        });
      });
    }

    // 오래된 알림 ID 정리 (메모리 최적화)
    // 알림이 너무 많아지면 전체 초기화 (100개 이상)
    if (notifiedIdsRef.current.size > 100) {
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
