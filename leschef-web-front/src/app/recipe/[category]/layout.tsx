"use client";

import Top from "@/components/common/top";
import TabNavigation from "@/components/common/TabNavigation";
import FilterTabs from "@/components/common/FilterTabs";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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
  const [matchMode, setMatchMode] = useState<"bestMatch" | "needFew">("bestMatch");
  const [includeMyInventory, setIncludeMyInventory] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Get current category from pathname
  const currentCategory = pathname.split("/").pop() || "korean";
  const currentDisplay = CATEGORY_TO_DISPLAY[currentCategory] || "한식";
  const subFiltersForActive =
    CUISINE_TO_SUBFILTERS[currentDisplay as keyof typeof CUISINE_TO_SUBFILTERS] || [];

  useEffect(() => {
    const loggedIn =
      typeof window !== "undefined" &&
      localStorage.getItem("leschef_is_logged_in") === "true";
    setIsLoggedIn(loggedIn);
    setIncludeMyInventory(loggedIn);
  }, []);
  const modeLabel = useMemo(
    () =>
      matchMode === "bestMatch"
        ? "내 재료와 많이 겹치는 순"
        : "부족 재료 1~2개만 사면 되는 순",
    [matchMode]
  );

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
          <div className="mb-6 rounded-3xl border border-gray-200 bg-gray-50 px-4 py-4">
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

        <div className="mb-8 rounded-3xl border border-gray-200 bg-white px-6 py-5 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-gray-400">Smart Filter</p>
          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">내 재료 기반 레시피 추천</h2>
            <span className="text-xs text-gray-500">
              {isLoggedIn ? "보관 재료 정보를 활용해 정렬할 수 있습니다." : "로그인 후 매칭 옵션을 이용해 보세요."}
            </span>
          </div>
        </div>

        {/* 정렬/옵션 툴바 */}
        <section className="mb-8 space-y-4 rounded-3xl border border-gray-200 bg-white px-6 py-5 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMatchMode("bestMatch")}
                disabled={!isLoggedIn}
                className={`rounded-2xl border px-4 py-2 text-xs font-semibold transition ${
                  matchMode === "bestMatch"
                    ? "border-gray-300 bg-gray-700 text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-400 hover:text-black"
                } ${!isLoggedIn ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                내 재료 매칭 우선
              </button>
              <button
                type="button"
                onClick={() => setMatchMode("needFew")}
                disabled={!isLoggedIn}
                className={`rounded-2xl border px-4 py-2 text-xs font-semibold transition ${
                  matchMode === "needFew"
                    ? "border-gray-300 bg-gray-700 text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-400 hover:text-black"
                } ${!isLoggedIn ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                부족 재료 1~2개
              </button>
            </div>
            <p className="text-xs text-gray-500">
              정렬 기준: <span className="font-semibold text-gray-900">{modeLabel}</span>
            </p>
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-medium text-gray-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
              checked={includeMyInventory}
              onChange={() => setIncludeMyInventory((prev) => !prev)}
              disabled={!isLoggedIn}
            />
            내 보관 재료와 비교
          </label>

          {!isLoggedIn && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-xs text-gray-500">
              로그인하면 내 보관 재료를 기반으로 한 맞춤 정렬 옵션을 사용할 수 있어요.
            </div>
          )}
        </section>

        {/* 카테고리별 컨텐츠 */}
        {children}
      </main>
    </div>
  );
}
