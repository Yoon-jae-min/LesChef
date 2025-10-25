"use client";

import Top from "@/components/common/top";
import TabNavigation from "@/components/common/TabNavigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  const tabs = [
    { label: "내 정보", path: "/myPage/info" },
    { label: "보관함", path: "/myPage/storage" },
    { label: "찜 레시피", path: "/myPage/favorites" },
    { label: "나의 레시피", path: "/myPage/recipes" },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Determine active tab based on current pathname
  const getActiveTab = () => {
    if (!isClient) return "내 정보"; // Return default during SSR
    if (pathname === "/myPage" || pathname === "/myPage/info") return "내 정보";
    if (pathname === "/myPage/storage") return "보관함";
    if (pathname === "/myPage/favorites") return "찜 레시피";
    if (pathname === "/myPage/recipes") return "나의 레시피";
    return "내 정보";
  };

  const handleTabChange = (tab: string) => {
    const tabInfo = tabs.find((t) => t.label === tab);
    if (tabInfo) {
      window.location.href = tabInfo.path;
    }
  };

  // Determine margin bottom based on active tab
  const getMarginBottom = () => {
    if (!isClient) return "mb-12"; // Return default during SSR
    const activeTab = getActiveTab();
    return activeTab === "보관함" ? "mb-6" : "mb-12";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <Top />
      
      {/* 메인 콘텐츠 */}
      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* 네비게이션 탭 */}
        <div className={getMarginBottom()}>
          <TabNavigation
            tabs={tabs.map((t) => t.label)}
            activeTab={getActiveTab()}
            onTabChange={handleTabChange}
          />
        </div>

        {/* 하위 페이지 컨텐츠 */}
        {children}
      </main>
    </div>
  );
}
