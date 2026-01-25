"use client";

import { useEffect } from "react";

export default function RecipePage() {
  useEffect(() => {
    // Redirect to korean (한식) as default
    if (typeof window !== 'undefined') {
      window.location.replace("/recipe/korean");
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-400">Loading...</p>
    </div>
  );
}


