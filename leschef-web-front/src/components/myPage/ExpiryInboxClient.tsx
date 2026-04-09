/**
 * 유통기한 알림 기록 (알림함) — 썸네일·장소·D-day·이름(있을 때만)
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  clearExpiryInbox,
  getExpiryInbox,
  removeExpiryInboxEntry,
  type ExpiryInboxBucket,
  type ExpiryInboxEntry,
} from "@/utils/helpers/expiryInbox";
import { resolveBackendAssetUrl } from "@/utils/helpers/imageUtils";

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

export default function ExpiryInboxClient() {
  const [items, setItems] = useState<ExpiryInboxEntry[]>([]);

  const refresh = useCallback(() => {
    setItems(getExpiryInbox());
  }, []);

  useEffect(() => {
    refresh();
    if (typeof window === "undefined") return;
    const onUpdated = () => refresh();
    window.addEventListener("leschef-expiry-inbox-updated", onUpdated);
    window.addEventListener("storage", onUpdated);
    return () => {
      window.removeEventListener("leschef-expiry-inbox-updated", onUpdated);
      window.removeEventListener("storage", onUpdated);
    };
  }, [refresh]);

  const handleClear = () => {
    if (items.length === 0) return;
    if (window.confirm("알림 기록을 모두 삭제할까요?")) {
      clearExpiryInbox();
      refresh();
    }
  };

  const handleRemove = (id: string) => {
    removeExpiryInboxEntry(id);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-600/90">Inbox</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            유통기한 알림 기록
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            화면 우측 토스트는 장소·건수 요약만 보여주고, 여기서 항목별로 확인할 수 있어요.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/myPage/notifications"
            className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            알림 설정
          </Link>
          <Link
            href="/myPage/storage"
            className="inline-flex items-center justify-center rounded-2xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            보관함
          </Link>
          <button
            type="button"
            onClick={handleClear}
            disabled={items.length === 0}
            className="inline-flex items-center justify-center rounded-2xl border border-red-200/90 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-40"
          >
            기록 비우기
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-stone-300/90 bg-stone-50/60 px-6 py-16 text-center text-sm text-stone-600">
          아직 저장된 유통기한 알림이 없어요. 메인에서 로그인 상태로 두면 새 알림이 쌓입니다.
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((entry) => {
            const img = entry.imageUrl ? resolveBackendAssetUrl(entry.imageUrl) : "";
            const title = entry.name?.trim() || "이름 없음";
            return (
              <li
                key={entry.id}
                className="flex gap-4 rounded-[24px] border border-stone-200/90 bg-white/95 p-4 shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.03]"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-stone-100 bg-stone-100">
                  {img ? (
                    <Image src={img} alt={title} fill className="object-cover" sizes="80px" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-stone-400">
                      사진 없음
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${bucketStyle(entry.bucket)}`}>
                      {bucketLabel(entry.bucket)}
                    </span>
                    <span className="text-sm text-stone-500">{entry.place.trim() || "보관함"}</span>
                  </div>
                  <p className="mt-1 truncate font-semibold text-stone-900">{title}</p>
                  <p className="mt-2 text-sm font-medium text-stone-800">{formatDday(entry.daysUntilExpiry)}</p>
                  <p className="mt-1 text-xs text-stone-400">
                    {new Date(entry.createdAt).toLocaleString("ko-KR")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(entry.id)}
                  className="shrink-0 self-start rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  삭제
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
