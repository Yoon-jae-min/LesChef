"use client";

import React from "react";

interface TabNavigationProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  const isActive = (tab: string) => activeTab === tab;

  return (
    <nav aria-label="레시피 요리 종류" className="flex justify-center">
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 sm:gap-x-8 md:gap-x-10">
        {tabs.map((tab) => {
          const active = isActive(tab);
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`relative whitespace-nowrap rounded-lg px-1 pb-1 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 sm:text-lg md:text-xl ${
                active
                  ? "text-orange-600 after:absolute after:bottom-0 after:left-1 after:right-1 after:h-0.5 after:rounded-full after:bg-orange-500"
                  : "text-stone-500 hover:text-stone-800"
              }`}
              aria-pressed={active}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default TabNavigation;
