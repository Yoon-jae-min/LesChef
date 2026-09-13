"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Top from "@/components/common/navigation/Top";
import BrandLogo from "@/components/common/ui/BrandLogo";
import {
  checkLoginStatus,
  isCurrentUserAdmin,
  getCurrentUser,
} from "@/utils/helpers/authUtils";
import { fetchUserInfo } from "@/utils/api/auth";
import { STORAGE_KEYS } from "@/constants/storage/storageKeys";

/**
 * 관리자 콘솔 1단계 — 골격 + 권한 게이트
 * 이후 공지/레시피/유저 관리 메뉴를 여기에 붙입니다.
 */
export default function AdminHomePage() {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [nickName, setNickName] = useState("");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!checkLoginStatus()) {
        window.location.href = `/login?back=${encodeURIComponent("/admin")}`;
        return;
      }

      // 로컬 힌트 먼저, 서버 getInfo 로 확정
      if (isCurrentUserAdmin()) {
        setAllowed(true);
        setNickName(getCurrentUser()?.nickName || "");
      }

      try {
        const info = await fetchUserInfo();
        if (cancelled) return;

        try {
          const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
          const cur = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
          localStorage.setItem(
            STORAGE_KEYS.CURRENT_USER,
            JSON.stringify({
              ...cur,
              id: info.id,
              name: info.name,
              nickName: info.nickName,
              tel: info.tel,
              checkAdmin: !!info.checkAdmin,
            })
          );
        } catch {
          /* ignore */
        }

        setNickName(info.nickName || "");
        setAllowed(!!info.checkAdmin);
      } catch {
        if (!cancelled) setAllowed(false);
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF9E8]">
        <div className="flex flex-col items-center gap-3 text-sm text-stone-600">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-green-600" />
          권한 확인 중…
        </div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-screen bg-white">
        <Top />
        <main className="mx-auto max-w-lg px-6 py-20 text-center">
          <h1 className="text-xl font-semibold text-stone-900">접근 권한 없음</h1>
          <p className="mt-3 text-sm text-stone-600">
            이 페이지는 관리자만 이용할 수 있습니다.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-2xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
          >
            홈으로
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8F5]">
      <header className="border-b border-lime-100 bg-white/95">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <BrandLogo />
            <span className="rounded-lg bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-800">
              Admin
            </span>
          </Link>
          <div className="flex items-center gap-3 text-sm text-stone-600">
            <span>{nickName || "관리자"}</span>
            <Link href="/" className="text-green-700 hover:underline">
              사이트로
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">관리자 콘솔</h1>
        <p className="mt-2 text-sm text-stone-600">
          1단계: 권한 게이트가 준비되었습니다. 다음 단계에서 운영 메뉴를 붙입니다.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-stone-900">공지 관리</h2>
            <p className="mt-1 text-sm text-stone-500">곧 추가 예정</p>
            <Link
              href="/board/notice"
              className="mt-4 inline-block text-sm font-medium text-green-700 hover:underline"
            >
              공지 게시판 보기 →
            </Link>
          </div>
          <div className="rounded-2xl border border-dashed border-stone-200 bg-white/60 p-5">
            <h2 className="font-semibold text-stone-400">레시피 검수</h2>
            <p className="mt-1 text-sm text-stone-400">다음 단계</p>
          </div>
          <div className="rounded-2xl border border-dashed border-stone-200 bg-white/60 p-5">
            <h2 className="font-semibold text-stone-400">유저·신고</h2>
            <p className="mt-1 text-sm text-stone-400">다음 단계</p>
          </div>
        </div>
      </main>
    </div>
  );
}
