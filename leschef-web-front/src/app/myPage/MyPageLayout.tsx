"use client";

import Top from "@/components/common/navigation/Top";
import TabNavigation from "@/components/common/navigation/TabNavigation";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, Suspense } from "react";
import { checkLoginStatus } from "@/utils/helpers/authUtils";
import { checkAuth } from "@/utils/api/auth";
import { STORAGE_KEYS } from "@/constants/storage/storageKeys";

function MyPageLayoutClientContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const tabs = [
    { label: "내 정보", path: "/myPage/info" },
    { label: "알림 기록", path: "/myPage/notifications/inbox" },
    { label: "알림 설정", path: "/myPage/notifications" },
    { label: "보관함", path: "/myPage/storage" },
    /** 기본 요리 종류(한식) — `/favorites` 리다이렉트 페이지를 거치지 않고 바로 목록으로 */
    { label: "찜 레시피", path: "/myPage/favorites/korean" },
    { label: "나의 레시피", path: "/myPage/recipes/korean" },
  ];

  const activeTab = useMemo(() => {
    // `/myPage`는 즉시 `/myPage/info`로 이동하므로 탭도 「내 정보」와 맞춤
    if (!pathname || pathname === "/myPage") return "내 정보";

    if (pathname.startsWith("/myPage/notifications/inbox")) return "알림 기록";
    if (pathname.startsWith("/myPage/notifications")) return "알림 설정";
    if (pathname.startsWith("/myPage/storage")) return "보관함";
    if (pathname.startsWith("/myPage/favorites")) return "찜 레시피";
    if (pathname.startsWith("/myPage/recipes")) return "나의 레시피";
    if (pathname.startsWith("/myPage/info")) return "내 정보";

    return "보관함";
  }, [pathname]);

  const marginBottom = useMemo(() => {
    if (activeTab === "찜 레시피" || activeTab === "나의 레시피") {
      return "mb-3";
    }
    if (activeTab === "알림 기록" || activeTab === "알림 설정") {
      return "mb-6";
    }
    if (activeTab === "보관함") {
      return "mb-6";
    }
    return "mb-12";
  }, [activeTab]);

  useEffect(() => {
    const verifyAuth = async () => {
      // 1차: 서버 세션 기준으로 인증 상태 확인
      const authResult = await checkAuth();
      const serverLoggedIn = authResult.loggedIn === true;

      // 2차: 클라이언트 플래그와 동기화
      const clientLoggedIn = checkLoginStatus();

      const loggedIn = serverLoggedIn && clientLoggedIn;

      if (!loggedIn) {
        if (typeof window !== "undefined") {
          const attemptedPath = window.location.pathname + window.location.search;
          sessionStorage.setItem(STORAGE_KEYS.FROM_SOURCE, "mypage");
          sessionStorage.setItem(STORAGE_KEYS.RETURN_TO, attemptedPath);
          window.location.replace("/login?from=mypage");
        }
        setIsAuthorized(false);
        setIsCheckingAuth(false);
        return;
      }

      setIsAuthorized(true);
      setIsCheckingAuth(false);
    };

    void verifyAuth();
  }, []);

  const handleTabChange = (tab: string) => {
    if (tab === activeTab) return;
    const tabInfo = tabs.find((t) => t.label === tab);
    if (tabInfo) {
      router.push(tabInfo.path);
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      <Top />
      <main className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <header className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-600/90">
            My Page
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            마이페이지
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-stone-600">
            내 정보와 알림, 보관함, 레시피를 한곳에서 관리해요.
          </p>
        </header>
        <div className={`flex flex-col gap-4 ${marginBottom}`}>
          <TabNavigation
            tabs={tabs.map((t) => t.label)}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
        {children}
      </main>

      {(isCheckingAuth || !isAuthorized) && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-white/90 backdrop-blur-sm">
          <span className="h-11 w-11 animate-spin rounded-full border-[3px] border-stone-200 border-t-orange-600" />
          <p className="text-sm text-stone-600" role="status" aria-live="polite">
            로그인 상태 확인 중…
          </p>
        </div>
      )}
    </div>
  );
}

export default function MyPageLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-screen bg-white">
          <Top />
          <main className="mx-auto flex min-h-[400px] max-w-7xl flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
            <span className="h-9 w-9 animate-spin rounded-full border-2 border-stone-200 border-t-orange-500" />
            <p className="mt-3 text-sm text-stone-500">불러오는 중…</p>
          </main>
        </div>
      }
    >
      <MyPageLayoutClientContent>{children}</MyPageLayoutClientContent>
    </Suspense>
  );
}
