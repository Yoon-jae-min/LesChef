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
          <p className="text-sm font-medium uppercase tracking-[0.4em] text-gray-400">Settings</p>
          <h2 className="text-3xl font-semibold text-gray-900">알림 설정</h2>
          <p className="text-sm text-gray-500">유통기한 알림 설정을 관리하세요.</p>
        </div>
        <Link
          href="/myPage/notifications/inbox"
          className="inline-flex items-center justify-center rounded-2xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 w-fit"
        >
          유통기한 알림 기록 보기
        </Link>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
        {/* 알림 활성화 */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">알림 활성화</h3>
              <p className="text-sm text-gray-500">유통기한 알림 기능을 켜거나 끕니다.</p>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">알림 유형</h3>

            {/* 만료 알림 */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 bg-red-50/50">
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
                  <h4 className="font-semibold text-gray-900">만료 알림</h4>
                  <p className="text-sm text-gray-500">식재료가 만료되었을 때 알림</p>
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
            <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 bg-orange-50/50">
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
                  <h4 className="font-semibold text-gray-900">긴급 알림 (1일 전)</h4>
                  <p className="text-sm text-gray-500">식재료가 1일 후 만료될 때 알림</p>
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
            <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 bg-yellow-50/50">
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
                  <h4 className="font-semibold text-gray-900">경고 알림 (3일 전)</h4>
                  <p className="text-sm text-gray-500">식재료가 3일 후 만료될 때 알림</p>
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
            <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 bg-blue-50/50">
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
                  <h4 className="font-semibold text-gray-900">알림 알림 (7일 전)</h4>
                  <p className="text-sm text-gray-500">식재료가 7일 후 만료될 때 알림</p>
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
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">자동 닫기</h3>
                  <p className="text-sm text-gray-500">알림이 자동으로 닫히는 시간을 설정합니다.</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    자동 닫기 시간: {settings.autoCloseDuration / 1000}초
                  </label>
                  <input
                    type="range"
                    min="3000"
                    max="10000"
                    step="1000"
                    value={settings.autoCloseDuration}
                    onChange={(e) => handleChange("autoCloseDuration", Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
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
        <div className="mt-8 pt-8 border-t border-gray-200 flex justify-end gap-4">
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            기본값으로 초기화
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="px-6 py-3 rounded-2xl bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            설정 저장
          </button>
        </div>
      </div>
    </div>
  );
}
