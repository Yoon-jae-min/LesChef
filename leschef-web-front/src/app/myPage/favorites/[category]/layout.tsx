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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function FavoritesCategoryLayoutInner({ children }: { children: React.ReactNode }) {
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
      router.push(`/myPage/favorites/${newSlug}`);
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
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-600/90">Favorites</p>
        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
            찜한 레시피 목록
          </h2>
          <span className="text-xs text-stone-600">저장한 레시피를 빠르게 확인해 보세요.</span>
        </div>
      </div>

      {children}
    </>
  );
}

function FavoritesLayoutFallback() {
  return (
    <div className="space-y-6">
      <div className="h-12 animate-pulse rounded-2xl bg-stone-100" />
      <div className="h-14 animate-pulse rounded-[28px] bg-stone-100" />
      <div className="h-24 animate-pulse rounded-[28px] bg-stone-100" />
      <div className="min-h-[200px] rounded-[28px] border border-dashed border-stone-200 bg-stone-50/80" />
    </div>
  );
}

export default function FavoritesCategoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<FavoritesLayoutFallback />}>
      <FavoritesCategoryLayoutInner>{children}</FavoritesCategoryLayoutInner>
    </Suspense>
  );
}
