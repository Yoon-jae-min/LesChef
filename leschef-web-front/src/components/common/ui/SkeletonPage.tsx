import React from "react";
import Skeleton from "@/components/common/ui/Skeleton";

type SkeletonPageProps = {
  titleWidthClassName?: string;
  cardCount?: number;
};

export default function SkeletonPage({
  titleWidthClassName = "w-44",
  cardCount = 8,
}: SkeletonPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* top bar placeholder */}
      <div className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4 lg:px-8">
          <Skeleton className="h-8 w-28 rounded-2xl" aria-label="로딩 중" />
          <div className="ml-6 hidden items-center gap-3 md:flex">
            <Skeleton className="h-8 w-8 rounded-xl" />
            <Skeleton className="h-8 w-8 rounded-xl" />
            <Skeleton className="h-8 w-8 rounded-xl" />
            <Skeleton className="h-8 w-8 rounded-xl" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-xl" />
            <Skeleton className="h-8 w-8 rounded-xl" />
            <Skeleton className="hidden h-9 w-56 rounded-2xl md:block" />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        <Skeleton className={`h-8 ${titleWidthClassName} rounded-2xl`} />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cardCount }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[4px_4px_0_rgba(0,0,0,0.04)]"
            >
              <Skeleton className="h-4 w-32 rounded-lg" />
              <Skeleton className="mt-3 h-3 w-24 rounded-lg" />
              <Skeleton className="mt-6 h-7 w-20 rounded-xl" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

