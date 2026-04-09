"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getExpiryInbox,
  type ExpiryInboxBucket,
  type ExpiryInboxEntry,
} from "@/utils/helpers/expiryInbox";

const PREVIEW_LIMIT = 5;

function formatDday(days: number | null): string {
  if (days === null || Number.isNaN(days)) return "D-day —";
  if (days < 0) return `만료 ${Math.abs(days)}일 전`;
  if (days === 0) return "오늘 만료";
  return `D-${days}`;
}

function bucketLabel(bucket: ExpiryInboxBucket): string {
  switch (bucket) {
    case "expired":
      return "만료";
    case "urgent":
      return "긴급";
    case "warning":
      return "경고";
    case "notice":
      return "알림";
  }
}

function bucketStyle(bucket: ExpiryInboxBucket): string {
  switch (bucket) {
    case "expired":
      return "bg-red-100 text-red-800";
    case "urgent":
      return "bg-orange-100 text-orange-800";
    case "warning":
      return "bg-yellow-100 text-yellow-800";
    case "notice":
      return "bg-blue-100 text-blue-800";
  }
}

export default function TopNotificationPopover(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ExpiryInboxEntry[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(() => {
    setItems(getExpiryInbox());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh, open]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onUpdated = () => refresh();
    window.addEventListener("leschef-expiry-inbox-updated", onUpdated);
    window.addEventListener("storage", onUpdated);
    return () => {
      window.removeEventListener("leschef-expiry-inbox-updated", onUpdated);
      window.removeEventListener("storage", onUpdated);
    };
  }, [refresh]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const preview = items.slice(0, PREVIEW_LIMIT);
  const total = items.length;
  const badgeText = total > 99 ? "99+" : String(total);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        title="알림"
        aria-label="유통기한 알림 미리보기"
        className={`relative flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
          open ? "bg-orange-100 text-orange-700" : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-6 w-6"
          aria-hidden
        >
          <path
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {total > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold leading-none text-white tabular-nums">
            {badgeText}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-[60] mt-2 w-[min(calc(100vw-2rem),20rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg"
          role="dialog"
          aria-label="알림 미리보기"
        >
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-semibold text-gray-900">알림</p>
            <p className="text-xs text-gray-500">유통기한 알림 기록 미리보기</p>
          </div>

          <div className="max-h-[min(60vh,18rem)] overflow-y-auto">
            {preview.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-gray-500">
                새 유통기한 알림이 오면 여기에 쌓여요.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {preview.map((entry) => {
                  const title = entry.name?.trim() || "이름 없음";
                  return (
                    <li key={entry.id} className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${bucketStyle(entry.bucket)}`}
                        >
                          {bucketLabel(entry.bucket)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {entry.place.trim() || "보관함"}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm font-medium text-gray-900">{title}</p>
                      <p className="mt-0.5 text-xs text-gray-600">{formatDday(entry.daysUntilExpiry)}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="border-t border-gray-100 bg-gray-50/80 px-3 py-2">
            <Link
              href="/myPage/notifications/inbox"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center rounded-xl py-2.5 text-sm font-semibold text-gray-900 hover:bg-white"
            >
              전체 보기
              {total > PREVIEW_LIMIT && (
                <span className="ml-1 text-xs font-normal text-gray-500">
                  · 외 {total - PREVIEW_LIMIT}건
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
