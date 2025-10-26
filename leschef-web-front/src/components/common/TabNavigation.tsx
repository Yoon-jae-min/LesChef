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
    <div className="flex items-center justify-center space-x-8 sm:space-x-12 md:space-x-16">
      {tabs.map((tab) => {
        const active = isActive(tab);
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
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
