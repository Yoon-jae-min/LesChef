"use client";

import React from "react";

interface FilterTabsProps {
  items: string[];
  activeItem: string;
  onItemChange: (item: string) => void;
  variant?: "default" | "gray";
}

function FilterTabs({ 
  items, 
  activeItem, 
  onItemChange,
  variant = "default"
}: FilterTabsProps) {
  const getActiveClasses = (isActive: boolean) => {
    if (variant === "gray") {
      return isActive
        ? "bg-gray-700 text-white border-gray-700"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100";
    }
    // default variant (black)
    return isActive
      ? "bg-black text-white border-black"
      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100";
  };

  return (
    <div className="flex items-center justify-center space-x-2 sm:space-x-3 md:space-x-4 flex-wrap gap-y-2">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onItemChange(item)}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border transition-colors text-xs sm:text-sm whitespace-nowrap ${getActiveClasses(activeItem === item)}`}
          aria-pressed={activeItem === item}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default FilterTabs;
