"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BoardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/board/notice");
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white px-4 text-stone-600">
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-stone-200 border-t-orange-500"
        aria-hidden
      />
      <p className="text-sm" role="status" aria-live="polite">
        게시판으로 이동하는 중…
      </p>
    </div>
  );
}
