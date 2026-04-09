"use client";

import TabNavigation from "@/components/common/navigation/TabNavigation";
import FilterTabs from "@/components/common/ui/FilterTabs";
import {
  FAVORITES_CUISINE_TABS,
  FAVORITES_DISPLAY_TO_SLUG,
  FAVORITES_SLUG_TO_DISPLAY,
  FAVORITES_SUB_CATEGORY_QUERY,
  favoritesSubFiltersForMajor,
  normalizeFavoritesSubSelection,
} from "@/constants/recipe/favoritesFilters";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function MyRecipesCategoryLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const slug = pathname.split("/").pop() || "korean";
  const currentDisplay = FAVORITES_SLUG_TO_DISPLAY[slug] || "한식";
  const subFilters = favoritesSubFiltersForMajor(currentDisplay);
  const subFromUrl = searchParams.get(FAVORITES_SUB_CATEGORY_QUERY);
  const activeSub = normalizeFavoritesSubSelection(currentDisplay, subFromUrl);

  const handleTabChange = (tab: string) => {
    const newSlug = FAVORITES_DISPLAY_TO_SLUG[tab];
    if (newSlug) {
      router.push(`/myPage/recipes/${newSlug}`);
    }
  };

  const handleSubChange = (item: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!item || item === "전체") {
      params.delete(FAVORITES_SUB_CATEGORY_QUERY);
    } else {
      params.set(FAVORITES_SUB_CATEGORY_QUERY, item);
    }
    const q = params.toString();
    router.push(q ? `${pathname}?${q}` : pathname);
  };

  return (
    <>
      <div className="mb-6">
        <TabNavigation
          tabs={[...FAVORITES_CUISINE_TABS]}
          activeTab={currentDisplay}
          onTabChange={handleTabChange}
        />
      </div>

      <div className="mb-6 rounded-[28px] border border-stone-200/90 bg-stone-50/70 px-4 py-4 shadow-sm ring-1 ring-stone-900/[0.03]">
        <FilterTabs
          items={subFilters}
          activeItem={activeSub}
          onItemChange={handleSubChange}
          variant="default"
        />
      </div>

      <div className="mb-6 rounded-[28px] border border-stone-200/90 bg-white/95 px-5 py-5 shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.03] sm:px-6 sm:py-5">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-600/90">My Recipes</p>
        <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">나의 레시피</h2>
            <span className="text-xs text-stone-600">직접 작성한 레시피를 목록으로 확인해요.</span>
          </div>
          <Link
            href="/myPage/recipes/write"
            className="inline-flex items-center justify-center rounded-2xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            레시피 작성
          </Link>
        </div>
      </div>

      {children}
    </>
  );
}

function MyRecipesLayoutFallback() {
  return (
    <div className="space-y-6">
      <div className="h-12 animate-pulse rounded-2xl bg-stone-100" />
      <div className="h-14 animate-pulse rounded-[28px] bg-stone-100" />
      <div className="h-24 animate-pulse rounded-[28px] bg-stone-100" />
      <div className="min-h-[200px] rounded-[28px] border border-dashed border-stone-200 bg-stone-50/80" />
    </div>
  );
}

export default function MyRecipesCategoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<MyRecipesLayoutFallback />}>
      <MyRecipesCategoryLayoutInner>{children}</MyRecipesCategoryLayoutInner>
    </Suspense>
  );
}
