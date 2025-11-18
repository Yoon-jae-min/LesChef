"use client";

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

export default function MyRecipesCategoryLayout({
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
      window.location.href = `/myPage/recipes/${newCategory}`;
    }
  };

  return (
    <>
      <div className="mb-6">
        <TabNavigation
          tabs={[...CUISINE_TABS]}
          activeTab={currentDisplay}
          onTabChange={handleTabChange}
        />
      </div>

      <div className="mb-6 rounded-3xl border border-gray-200 bg-gray-50 px-4 py-4">
        <FilterTabs
          items={[...subFiltersForActive]}
          activeItem={activeSub}
          onItemChange={setActiveSub}
          variant="default"
        />
      </div>

      <div className="mb-6 rounded-3xl border border-gray-200 bg-white px-6 py-5 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
        <p className="text-xs font-medium uppercase tracking-[0.4em] text-gray-400">My Recipes</p>
        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">나의 레시피</h2>
          <span className="text-xs text-gray-500">직접 작성한 레시피를 목록으로 확인해요.</span>
        </div>
      </div>

      {children}
    </>
  );
}
