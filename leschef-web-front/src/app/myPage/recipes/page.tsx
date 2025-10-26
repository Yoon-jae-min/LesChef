"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyRecipesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to korean (한식) as default
    router.replace("/myPage/recipes/korean");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p className="text-gray-400">Loading...</p>
    </div>
  );
}
