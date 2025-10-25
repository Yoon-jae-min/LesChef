"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyPageDefault() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to info page as default
    router.replace("/myPage/info");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-400">Loading...</p>
    </div>
  );
}
