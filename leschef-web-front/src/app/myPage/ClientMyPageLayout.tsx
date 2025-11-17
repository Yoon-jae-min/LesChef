"use client";

import Top from "@/components/common/top";
import TabNavigation from "@/components/common/TabNavigation";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function ClientMyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
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
    const loggedIn =
      typeof window !== "undefined" &&
      localStorage.getItem("leschef_is_logged_in") === "true";

    if (!loggedIn) {
      setIsAuthorized(false);
      setIsCheckingAuth(false);
      router.replace("/login");
      return;
    }

    setIsAuthorized(true);
    setIsCheckingAuth(false);
  }, [router]);

  const handleTabChange = (tab: string) => {
    const tabInfo = tabs.find((t) => t.label === tab);
    if (tabInfo) {
      window.location.href = tabInfo.path;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("leschef_is_logged_in");
    router.push("/login");
  };

  const showOverlay = isCheckingAuth || !isAuthorized;

  return (
    <div className="relative min-h-screen bg-white">
      <Top />
      <main className="max-w-6xl mx-auto px-8 py-8">
        <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${marginBottom}`}>
          <TabNavigation
            tabs={tabs.map((t) => t.label)}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <button
            type="button"
            onClick={handleLogout}
            className="self-start rounded-2xl border border-black px-6 py-2 text-sm font-medium text-gray-900 transition hover:-translate-y-0.5 hover:bg-black hover:text-white"
          >
            로그아웃
          </button>
        </div>
        {children}
      </main>

      {showOverlay && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-600" />
          <p className="text-sm text-gray-500">로그인 상태 확인 중...</p>
        </div>
      )}
    </div>
  );
}

