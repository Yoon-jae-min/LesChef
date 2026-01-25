"use client";

import { useEffect } from "react";

export default function BoardPage() {
  useEffect(() => {
    // Redirect to notice (공지사항) as default
    if (typeof window !== 'undefined') {
      window.location.replace("/board/notice");
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-400">Loading...</p>
    </div>
  );
}
