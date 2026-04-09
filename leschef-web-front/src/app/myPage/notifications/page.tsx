/**
 * 알림 설정 페이지
 * 유통기한 알림 설정을 관리
 */

"use client";

// 동적 렌더링 강제 (useSearchParams 이슈 방지)
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  getNotificationSettings,
  saveNotificationSettings,
  resetNotificationSettings,
  type NotificationSettings,
} from "@/utils/helpers/notification";
import { useNotification } from "@/contexts/Notification";

export default function NotificationSettingsPage() {
  const { addNotification } = useNotification();
  const [settings, setSettings] = useState<NotificationSettings>(getNotificationSettings());
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // 설정이 변경되었는지 확인
    const current = getNotificationSettings();
    setHasChanges(JSON.stringify(current) !== JSON.stringify(settings));
  }, [settings]);

  const handleChange = (key: keyof NotificationSettings, value: boolean | number) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    saveNotificationSettings(settings);
    setHasChanges(false);
    addNotification({
      type: "success",
      title: "설정 저장 완료",
      message: "알림 설정이 저장되었습니다.",
      duration: 3000,
    });
  };

  const handleReset = () => {
    if (window.confirm("알림 설정을 기본값으로 초기화하시겠습니까?")) {
      resetNotificationSettings();
      const defaultSettings = getNotificationSettings();
      setSettings(defaultSettings);
      setHasChanges(false);
      addNotification({
        type: "success",
        title: "설정 초기화 완료",
        message: "알림 설정이 기본값으로 초기화되었습니다.",
        duration: 3000,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-600/90">
            Settings
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            알림 설정
          </h2>
          <p className="mt-1 text-sm text-stone-600">유통기한 알림을 내게 맞게 조정해요.</p>
        </div>
        <Link
          href="/myPage/notifications/inbox"
          className="inline-flex w-fit items-center justify-center rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        >
          유통기한 알림 기록 보기
        </Link>
      </div>

      <div className="rounded-[28px] border border-stone-200/90 bg-white/95 p-6 shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.03] sm:p-8">
        {/* 알림 활성화 */}
        <div className="mb-8 border-b border-stone-200/90 pb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-1 text-lg font-semibold text-stone-900">알림 활성화</h3>
              <p className="text-sm text-stone-600">유통기한 알림 기능을 켜거나 끕니다.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => handleChange("enabled", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>
        </div>

        {/* 알림 유형 설정 */}
        {settings.enabled && (
          <div className="space-y-6">
            <h3 className="mb-4 text-lg font-semibold text-stone-900">알림 유형</h3>

            {/* 만료 알림 */}
            <div className="flex items-center justify-between rounded-2xl border border-red-200/80 bg-red-50/60 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5 text-red-600"
                  >
                    <path
                      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" />
                    <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900">만료 알림</h4>
                  <p className="text-sm text-stone-600">식재료가 만료되었을 때 알림</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showExpired}
                  onChange={(e) => handleChange("showExpired", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            {/* 긴급 알림 (1일 전) */}
            <div className="flex items-center justify-between rounded-2xl border border-orange-200/80 bg-orange-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5 text-orange-600"
                  >
                    <path
                      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" />
                    <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900">긴급 알림 (1일 전)</h4>
                  <p className="text-sm text-stone-600">식재료가 1일 후 만료될 때 알림</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showUrgent}
                  onChange={(e) => handleChange("showUrgent", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            {/* 경고 알림 (3일 전) */}
            <div className="flex items-center justify-between rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5 text-yellow-600"
                  >
                    <path
                      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" />
                    <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900">경고 알림 (3일 전)</h4>
                  <p className="text-sm text-stone-600">식재료가 3일 후 만료될 때 알림</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showWarning}
                  onChange={(e) => handleChange("showWarning", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
              </label>
            </div>

            {/* 알림 알림 (7일 전) */}
            <div className="flex items-center justify-between rounded-2xl border border-sky-200/80 bg-sky-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5 text-blue-600"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" strokeLinecap="round" />
                    <line x1="12" y1="8" x2="12.01" y2="8" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900">알림 알림 (7일 전)</h4>
                  <p className="text-sm text-stone-600">식재료가 7일 후 만료될 때 알림</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showNotice}
                  onChange={(e) => handleChange("showNotice", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        )}

        {/* 자동 닫기 설정 */}
        {settings.enabled && (
          <div className="mt-8 border-t border-stone-200/90 pt-8">
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-stone-900">자동 닫기</h3>
                  <p className="text-sm text-stone-600">알림이 자동으로 닫히는 시간을 설정합니다.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoClose}
                    onChange={(e) => handleChange("autoClose", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>

              {settings.autoClose && (
                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-stone-800">
                    자동 닫기 시간: {settings.autoCloseDuration / 1000}초
                  </label>
                  <input
                    type="range"
                    min="3000"
                    max="10000"
                    step="1000"
                    value={settings.autoCloseDuration}
                    onChange={(e) => handleChange("autoCloseDuration", Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-orange-600"
                  />
                  <div className="mt-1 flex justify-between text-xs text-stone-500">
                    <span>3초</span>
                    <span>5초</span>
                    <span>7초</span>
                    <span>10초</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 저장 버튼 */}
        <div className="mt-8 flex justify-end gap-3 border-t border-stone-200/90 pt-8 sm:gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-2xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 shadow-sm transition-colors hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            기본값으로 초기화
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges}
            className="rounded-2xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            설정 저장
          </button>
        </div>
      </div>
    </div>
  );
}
