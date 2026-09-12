"use client";

import Top from "@/components/common/navigation/Top";
import TabNavigation from "@/components/common/navigation/TabNavigation";
import CitrusPageBanner from "@/components/common/ui/CitrusPageBanner";
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
      <CitrusPageBanner
        eyebrow="Community"
        title="LesChef 보드"
        description="공지와 자유게시판에서 소식과 이야기를 나눠 보세요."
      />

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <TabNavigation
            tabs={[...BOARD_TABS]}
            activeTab={currentDisplay}
            onTabChange={handleTabChange}
          />
          <Link
            href={`/board/write?type=${currentCategory}`}
            className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            글쓰기
          </Link>
        </div>

        {children}
      </main>
    </div>
  );
}
