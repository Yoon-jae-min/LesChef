"use client";

import Top from "@/components/common/top";
import TabNavigation from "@/components/common/TabNavigation";
import FilterTabs from "@/components/common/FilterTabs";
import { usePathname } from "next/navigation";
import { useState } from "react";

const CUISINE_TABS = ["한식", "일식", "중식", "양식", "기타"] as const;
const CATEGORY_TO_DISPLAY: Record<string, string> = {
  korean: "한식",
  japanese: "일식",
  chinese: "중식",
  western: "양식",
  etc: "기타",
};

const DISPLAY_TO_CATEGORY: Record<string, string> = {
  한식: "korean",
  일식: "japanese",
  중식: "chinese",
  양식: "western",
  기타: "etc",
};

const CUISINE_TO_SUBFILTERS: Record<(typeof CUISINE_TABS)[number], readonly string[]> = {
  한식: ["전체", "국, 찌개", "밥, 면", "반찬", "기타"],
  일식: ["전체", "국, 전골", "면", "밥", "기타"],
  중식: ["전체", "튀김, 찜", "면", "밥", "기타"],
  양식: ["전체", "스프, 스튜", "면", "빵", "기타"],
  기타: [],
} as const;

export default function RecipeCategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeSub, setActiveSub] = useState<string>("전체");

  // Get current category from pathname
  const currentCategory = pathname.split("/").pop() || "korean";
  const currentDisplay = CATEGORY_TO_DISPLAY[currentCategory] || "한식";
  const subFiltersForActive = CUISINE_TO_SUBFILTERS[currentDisplay as keyof typeof CUISINE_TO_SUBFILTERS] || [];

  const handleTabChange = (tab: string) => {
    const newCategory = DISPLAY_TO_CATEGORY[tab];
    if (newCategory) {
      window.location.href = `/recipe/${newCategory}`;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Top />
      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* 상단 카테고리 탭 */}
        <div className="mb-6">
          <TabNavigation
            tabs={[...CUISINE_TABS]}
            activeTab={currentDisplay}
            onTabChange={handleTabChange}
          />
        </div>

        {/* 서브 필터 pill */}
        {subFiltersForActive.length > 0 ? (
          <div className="mb-6">
            <FilterTabs
              items={[...subFiltersForActive]}
              activeItem={activeSub}
              onItemChange={setActiveSub}
              variant="default"
            />
          </div>
        ) : (
          <div className="h-4" />
        )}

        {/* 카테고리별 컨텐츠 */}
        {children}
      </main>
    </div>
  );
}
