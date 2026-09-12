"use client";

import Top from "@/components/common/navigation/Top";
import TabNavigation from "@/components/common/navigation/TabNavigation";
import FilterTabs from "@/components/common/ui/FilterTabs";
import CitrusPageBanner from "@/components/common/ui/CitrusPageBanner";
import SearchBar from "@/components/recipe/search/SearchBar";
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
  const [bannerKeyword, setBannerKeyword] = useState("");

  const currentCategory = pathname.split("/").pop() || "korean";
  const currentDisplay = CATEGORY_TO_DISPLAY[currentCategory] || "한식";
  const subFiltersForActive =
    CUISINE_TO_SUBFILTERS[currentDisplay as keyof typeof CUISINE_TO_SUBFILTERS] || [];

  const syncSubFromUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("subCategory")?.trim();
    setActiveSub(raw && raw.length > 0 ? raw : "전체");
    setBannerKeyword(params.get("keyword")?.trim() || "");
  }, []);

  useEffect(() => {
    syncSubFromUrl();
  }, [pathname, syncSubFromUrl]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onPop = () => syncSubFromUrl();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [syncSubFromUrl]);

  const handleBannerSearch = useCallback((keyword: string) => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    params.delete("ingredients");
    const trimmed = keyword.trim();
    if (trimmed) params.set("keyword", trimmed);
    else params.delete("keyword");
    const base = window.location.pathname;
    const qs = params.toString();
    window.history.pushState({}, "", qs ? `${base}?${qs}` : base);
    window.dispatchEvent(new PopStateEvent("popstate"));
    setBannerKeyword(trimmed);
  }, []);

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
      <CitrusPageBanner
        eyebrow="Recipe"
        title="레시피 찾기"
        description="요리 종류와 세부 카테고리로 빠르게 골라보세요."
      >
        <SearchBar
          variant="hero"
          initialKeyword={bannerKeyword}
          onSearch={handleBannerSearch}
          className="mx-auto"
        />
      </CitrusPageBanner>

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <TabNavigation
            tabs={[...CUISINE_TABS]}
            activeTab={currentDisplay}
            onTabChange={handleTabChange}
          />
        </div>

        {subFiltersForActive.length > 0 ? (
          <div className="mb-8 rounded-2xl border border-lime-100 bg-lime-50/40 px-4 py-4 sm:px-5 sm:py-5">
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
