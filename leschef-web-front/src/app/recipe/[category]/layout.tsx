"use client";

import Top from "@/components/common/navigation/Top";
import TabNavigation from "@/components/common/navigation/TabNavigation";
import FilterTabs from "@/components/common/ui/FilterTabs";
import { RECIPE_SUBCATEGORIES_BY_MAJOR } from "@/constants/recipe/recipe";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const CUISINE_TABS = ["전체", "한식", "일식", "중식", "양식", "기타"] as const;
const CATEGORY_TO_DISPLAY: Record<string, string> = {
  all: "전체",
  korean: "한식",
  japanese: "일식",
  chinese: "중식",
  western: "양식",
  etc: "기타",
};

const DISPLAY_TO_CATEGORY: Record<string, string> = {
  전체: "all",
  한식: "korean",
  일식: "japanese",
  중식: "chinese",
  양식: "western",
  기타: "etc",
};

const CUISINE_TO_SUBFILTERS: Record<(typeof CUISINE_TABS)[number], readonly string[]> = {
  전체: [],
  한식: RECIPE_SUBCATEGORIES_BY_MAJOR.한식,
  일식: RECIPE_SUBCATEGORIES_BY_MAJOR.일식,
  중식: RECIPE_SUBCATEGORIES_BY_MAJOR.중식,
  양식: RECIPE_SUBCATEGORIES_BY_MAJOR.양식,
  기타: [],
} as const;

export default function RecipeCategoryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeSub, setActiveSub] = useState<string>("전체");

  const currentCategory = pathname.split("/").pop() || "korean";
  const currentDisplay = CATEGORY_TO_DISPLAY[currentCategory] || "한식";
  const subFiltersForActive =
    CUISINE_TO_SUBFILTERS[currentDisplay as keyof typeof CUISINE_TO_SUBFILTERS] || [];

  const syncSubFromUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    const raw = new URLSearchParams(window.location.search).get("subCategory")?.trim();
    setActiveSub(raw && raw.length > 0 ? raw : "전체");
  }, []);

  /** URL ?subCategory= 과 탭 동기화 (카테고리 변경·뒤로가기 등) */
  useEffect(() => {
    syncSubFromUrl();
  }, [pathname, syncSubFromUrl]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onPop = () => syncSubFromUrl();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [syncSubFromUrl]);

  const handleSubChange = useCallback((sub: string) => {
    setActiveSub(sub);
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (sub === "전체") {
      params.delete("subCategory");
    } else {
      params.set("subCategory", sub);
    }
    const base = window.location.pathname;
    const qs = params.toString();
    window.history.pushState({}, "", qs ? `${base}?${qs}` : base);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);

  const handleTabChange = (tab: string) => {
    if (tab === currentDisplay) return;
    const newCategory = DISPLAY_TO_CATEGORY[tab];
    if (newCategory) {
      router.push(`/recipe/${newCategory}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Top />
      <main className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <header className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-600/90">
            Recipe
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            레시피 찾기
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-stone-600">
            요리 종류와 세부 카테고리로 빠르게 골라보세요.
          </p>
        </header>

        <div className="mb-8 sm:mb-10">
          <TabNavigation
            tabs={[...CUISINE_TABS]}
            activeTab={currentDisplay}
            onTabChange={handleTabChange}
          />
        </div>

        {subFiltersForActive.length > 0 ? (
          <div className="mb-8 rounded-3xl border border-stone-200/80 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-sm sm:px-5 sm:py-5">
            <p className="sr-only">세부 카테고리 필터</p>
            <FilterTabs
              items={[...subFiltersForActive]}
              activeItem={activeSub}
              onItemChange={handleSubChange}
              variant="default"
            />
          </div>
        ) : (
          <div className="h-2 sm:h-4" aria-hidden />
        )}

        {children}
      </main>
    </div>
  );
}
