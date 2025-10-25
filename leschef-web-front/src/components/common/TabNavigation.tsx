"use client";

import React, { useEffect, useState } from "react";

interface TabNavigationProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always render the same structure to avoid hydration issues
  // During SSR and initial render, use the prop directly to avoid mismatch
  const isActive = (tab: string) => {
    // After mount, we can use the mounted state
    // Before mount (SSR), use the prop directly to ensure server and client match
    if (!mounted) {
      return activeTab === tab;
    }
    return activeTab === tab;
  };

  return (
    <div className="flex items-center justify-center space-x-8 sm:space-x-12 md:space-x-16">
      {tabs.map((tab) => {
        const active = isActive(tab);
        return (
          <button
            key={tab}
            onClick={mounted ? () => onTabChange(tab) : undefined}
            className={`text-lg sm:text-xl md:text-2xl font-semibold transition-colors whitespace-nowrap ${
              active ? "text-black" : "text-gray-400 hover:text-gray-700"
            }`}
            aria-pressed={active}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

export default TabNavigation;
