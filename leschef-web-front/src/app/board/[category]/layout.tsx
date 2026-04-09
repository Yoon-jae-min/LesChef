"use client";

import Top from "@/components/common/navigation/Top";
import TabNavigation from "@/components/common/navigation/TabNavigation";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const BOARD_TABS = ["공지사항", "자유게시판"] as const;

const CATEGORY_TO_DISPLAY: Record<string, string> = {
  notice: "공지사항",
  free: "자유게시판",
};

const DISPLAY_TO_CATEGORY: Record<string, string> = {
  공지사항: "notice",
  자유게시판: "free",
};

export default function BoardCategoryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Get current category from pathname
  const currentCategory = pathname.split("/").pop() || "notice";
  const currentDisplay = CATEGORY_TO_DISPLAY[currentCategory] || "공지사항";

  const handleTabChange = (tab: string) => {
    if (tab === currentDisplay) return;
    const newCategory = DISPLAY_TO_CATEGORY[tab];
    if (newCategory) {
      router.push(`/board/${newCategory}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Top />
      <main className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <header className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-600/90">
            Community
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            LesChef 보드
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-stone-600">
            공지와 자유게시판에서 소식과 이야기를 나눠 보세요.
          </p>
        </header>

        <div className="mb-8 sm:mb-10">
          <TabNavigation
            tabs={[...BOARD_TABS]}
            activeTab={currentDisplay}
            onTabChange={handleTabChange}
          />
        </div>

        <div className="mb-8 flex flex-col gap-4 rounded-[28px] border border-stone-200/90 bg-white/95 px-5 py-5 shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.03] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-stone-500">
              {currentDisplay}
            </p>
            <p className="mt-1 text-sm font-medium text-stone-800">
              이 카테고리의 글을 모아 보여 드려요.
            </p>
          </div>
          <Link
            href={`/board/write?type=${currentCategory}`}
            className="inline-flex items-center justify-center rounded-2xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            글쓰기
          </Link>
        </div>

        {children}
      </main>
    </div>
  );
}
