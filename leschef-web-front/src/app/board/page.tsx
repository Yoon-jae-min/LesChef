"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BoardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to notice (공지사항) as default
    router.replace("/board/notice");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-400">Loading...</p>
    </div>
  );
}
