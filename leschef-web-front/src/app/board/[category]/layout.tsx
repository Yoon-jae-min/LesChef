"use client";

import Top from "@/components/common/top";
import TabNavigation from "@/components/common/TabNavigation";
import { usePathname } from "next/navigation";

const BOARD_TABS = ["공지사항", "자유게시판"] as const;

const CATEGORY_TO_DISPLAY: Record<string, string> = {
  notice: "공지사항",
  free: "자유게시판",
};

const DISPLAY_TO_CATEGORY: Record<string, string> = {
  공지사항: "notice",
  자유게시판: "free",
};

export default function BoardCategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Get current category from pathname
  const currentCategory = pathname.split("/").pop() || "notice";
  const currentDisplay = CATEGORY_TO_DISPLAY[currentCategory] || "공지사항";

  const handleTabChange = (tab: string) => {
    const newCategory = DISPLAY_TO_CATEGORY[tab];
    if (newCategory) {
      window.location.href = `/board/${newCategory}`;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Top />
      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* 상단 카테고리 탭 */}
        <div className="mb-8">
          <TabNavigation
            tabs={[...BOARD_TABS]}
            activeTab={currentDisplay}
            onTabChange={handleTabChange}
          />
        </div>

        {/* 카테고리별 컨텐츠 */}
        {children}
      </main>
    </div>
  );
}
