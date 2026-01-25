"use client";

// 동적 렌더링 강제 (useSearchParams 이슈 방지)
export const dynamic = 'force-dynamic';

import { useEffect } from "react";

export default function FavoritesPage() {
  useEffect(() => {
    // Redirect to korean (한식) as default
    if (typeof window !== 'undefined') {
      window.location.replace("/myPage/favorites/korean");
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p className="text-gray-400">Loading...</p>
    </div>
  );
}
