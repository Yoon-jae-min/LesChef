/**
 * 알림 컴포넌트 (Toast 스타일)
 * 유통기한 알림 등을 표시
 */

"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export type NotificationType = 'expired' | 'urgent' | 'warning' | 'notice' | 'info' | 'success' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // 자동 닫기 시간 (ms), 0이면 수동 닫기만
  action?: {
    label: string;
    href: string;
  };
}

interface NotificationProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const getNotificationStyles = (type: NotificationType) => {
  switch (type) {
    case 'expired':
      return {
        container: 'bg-red-50 border-red-200 text-red-900',
        icon: 'text-red-600',
        button: 'bg-red-100 hover:bg-red-200 text-red-900',
      };
    case 'urgent':
      return {
        container: 'bg-orange-50 border-orange-200 text-orange-900',
        icon: 'text-orange-600',
        button: 'bg-orange-100 hover:bg-orange-200 text-orange-900',
      };
    case 'warning':
      return {
        container: 'bg-yellow-50 border-yellow-200 text-yellow-900',
        icon: 'text-yellow-600',
        button: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-900',
      };
    case 'notice':
      return {
        container: 'bg-blue-50 border-blue-200 text-blue-900',
        icon: 'text-blue-600',
        button: 'bg-blue-100 hover:bg-blue-200 text-blue-900',
      };
    case 'info':
      return {
        container: 'bg-gray-50 border-gray-200 text-gray-900',
        icon: 'text-gray-600',
        button: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
      };
    case 'success':
      return {
        container: 'bg-green-50 border-green-200 text-green-900',
        icon: 'text-green-600',
        button: 'bg-green-100 hover:bg-green-200 text-green-900',
      };
    case 'error':
      return {
        container: 'bg-red-50 border-red-200 text-red-900',
        icon: 'text-red-600',
        button: 'bg-red-100 hover:bg-red-200 text-red-900',
      };
  }
};

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'expired':
    case 'urgent':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round"/>
          <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round"/>
        </svg>
      );
    case 'warning':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round"/>
          <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round"/>
        </svg>
      );
    case 'notice':
    case 'info':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12" strokeLinecap="round"/>
          <line x1="12" y1="8" x2="12.01" y2="8" strokeLinecap="round"/>
        </svg>
      );
    case 'success':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'error':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round"/>
          <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round"/>
        </svg>
      );
  }
};

export default function NotificationItem({ notification, onClose }: NotificationProps) {
  const styles = getNotificationStyles(notification.type);
  const icon = getNotificationIcon(notification.type);

  // 자동 닫기
  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        onClose(notification.id);
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.id, notification.duration, onClose]);

  return (
    <div
      className={`rounded-2xl border p-4 shadow-lg min-w-[320px] max-w-[420px] ${styles.container} animate-slide-in-right`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* 아이콘 */}
        <div className={`flex-shrink-0 ${styles.icon}`}>
          {icon}
        </div>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
          <p className="text-sm opacity-90">{notification.message}</p>

          {/* 액션 버튼 */}
          {notification.action && (
            <div className="mt-3">
              <Link
                href={notification.action.href}
                className={`inline-block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${styles.button}`}
                onClick={() => onClose(notification.id)}
              >
                {notification.action.label}
              </Link>
            </div>
          )}
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={() => onClose(notification.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="알림 닫기"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

