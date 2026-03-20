/**
 * 알림 컨텍스트 및 훅
 * 전역 알림 상태 관리
 */

"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import Notification, {
  type Notification as NotificationType,
} from "@/components/common/ui/Notification";

interface NotificationContextType {
  notifications: NotificationType[];
  addNotification: (notification: Omit<NotificationType, "id">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const addNotification = useCallback((notification: Omit<NotificationType, "id">) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: NotificationType = {
      ...notification,
      id,
      duration: notification.duration ?? 5000, // 기본 5초
    };

    setNotifications((prev) => [...prev, newNotification]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      addNotification,
      removeNotification,
      clearAll,
    }),
    [notifications, addNotification, removeNotification, clearAll]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* 알림 컨테이너 */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 pointer-events-none">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <Notification notification={notification} onClose={removeNotification} />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
