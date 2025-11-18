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
        <div className="mb-6">
          <TabNavigation
            tabs={[...BOARD_TABS]}
            activeTab={currentDisplay}
            onTabChange={handleTabChange}
          />
        </div>

        <div className="mb-8 rounded-3xl border border-gray-200 bg-white px-6 py-5 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-gray-400">Community</p>
          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">LesChef 보드</h2>
            <span className="text-xs text-gray-500">
              공지와 자유게시판 모두 동일한 스타일로 정보를 확인할 수 있어요.
            </span>
          </div>
        </div>

        {/* 카테고리별 컨텐츠 */}
        {children}
      </main>
    </div>
  );
}
