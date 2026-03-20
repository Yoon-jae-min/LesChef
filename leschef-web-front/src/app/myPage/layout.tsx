import type { ReactNode } from "react";
import { Suspense } from "react";
import MyPageLayoutClient from "./MyPageLayout";

export default function MyPageLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-screen bg-white">
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <MyPageLayoutClient>{children}</MyPageLayoutClient>
    </Suspense>
  );
}
