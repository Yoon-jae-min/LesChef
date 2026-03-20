"use client";

import Top from "@/components/common/navigation/Top";
import TabNavigation from "@/components/common/navigation/TabNavigation";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, Suspense } from "react";
import { checkLoginStatus } from "@/utils/helpers/authUtils";
import { checkAuth } from "@/utils/api/auth";
import { STORAGE_KEYS } from "@/constants/storage/storageKeys";

function MyPageLayoutClientContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const tabs = [
    { label: "내 정보", path: "/myPage/info" },
    { label: "보관함", path: "/myPage/storage" },
    { label: "찜 레시피", path: "/myPage/favorites" },
    { label: "나의 레시피", path: "/myPage/recipes" },
  ];

  const activeTab = useMemo(() => {
    if (!pathname || pathname === "/myPage") return "보관함";

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
    const tabInfo = tabs.find((t) => t.label === tab);
    if (tabInfo) {
      window.location.href = tabInfo.path;
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      <Top />
      <main className="max-w-6xl mx-auto px-8 py-8">
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
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-600" />
          <p className="text-sm text-gray-500">로그인 상태 확인 중...</p>
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
          <main className="max-w-6xl mx-auto px-8 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <p className="text-gray-400">Loading...</p>
            </div>
          </main>
        </div>
      }
    >
      <MyPageLayoutClientContent>{children}</MyPageLayoutClientContent>
    </Suspense>
  );
}
