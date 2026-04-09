import type { ReactNode } from "react";
import { Suspense } from "react";
import MyPageLayoutClient from "./MyPageLayout";

export default function MyPageLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-screen bg-white">
          <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4">
            <span className="h-9 w-9 animate-spin rounded-full border-2 border-stone-200 border-t-orange-500" />
            <p className="text-sm text-stone-500" role="status">
              불러오는 중…
            </p>
          </div>
        </div>
      }
    >
      <MyPageLayoutClient>{children}</MyPageLayoutClient>
    </Suspense>
  );
}
