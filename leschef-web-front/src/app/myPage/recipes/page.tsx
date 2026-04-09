"use client";

// 동적 렌더링 강제 (useSearchParams 이슈 방지)
export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyRecipesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/myPage/recipes/korean");
  }, [router]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
      <span className="h-9 w-9 animate-spin rounded-full border-2 border-stone-200 border-t-orange-500" />
      <p className="text-sm text-stone-500" role="status" aria-live="polite">
        나의 레시피로 이동 중…
      </p>
    </div>
  );
}
