"use client";

// 동적 렌더링 강제 (useSearchParams 이슈 방지)
export const dynamic = 'force-dynamic';

import { useEffect } from "react";

export default function MyPageDefault() {
  useEffect(() => {
    // Redirect to info page as default
    if (typeof window !== 'undefined') {
      window.location.replace("/myPage/info");
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-400">Loading...</p>
    </div>
  );
}
