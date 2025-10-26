"use client";

import Top from "@/components/common/top";
import TabNavigation from "@/components/common/TabNavigation";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const tabs = [
    { label: "내 정보", path: "/myPage/info" },
    { label: "보관함", path: "/myPage/storage" },
    { label: "찜 레시피", path: "/myPage/favorites" },
    { label: "나의 레시피", path: "/myPage/recipes" },
  ];

  // Determine active tab based on current pathname
  const activeTab = useMemo(() => {
    // Check for each path condition explicitly
    if (!pathname || pathname === "/myPage") return "보관함"; // Default to 보관함 for SSR
    
    if (pathname.startsWith("/myPage/storage")) return "보관함";
    if (pathname.startsWith("/myPage/favorites")) return "찜 레시피";
    if (pathname.startsWith("/myPage/recipes")) return "나의 레시피";
    if (pathname.startsWith("/myPage/info")) return "내 정보";
    
    // Default to 보관함
    return "보관함";
  }, [pathname]);

  const handleTabChange = (tab: string) => {
    const tabInfo = tabs.find((t) => t.label === tab);
    if (tabInfo) {
      window.location.href = tabInfo.path;
    }
  };

  // Determine margin bottom based on active tab
  const marginBottom = useMemo(() => {
    // console.log(activeTab);
    if (activeTab === "찜 레시피" || activeTab === "나의 레시피") {
      return "mb-3";
    }
    if (activeTab === "보관함") {
      return "mb-6";
    }
    return "mb-12"; // 내 정보
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <Top />
      
      {/* 메인 콘텐츠 */}
      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* 네비게이션 탭 */}
        <div className={marginBottom}>
          <TabNavigation
            tabs={tabs.map((t) => t.label)}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        {/* 하위 페이지 컨텐츠 */}
        {children}
      </main>
    </div>
  );
}
