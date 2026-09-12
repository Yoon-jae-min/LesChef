"use client";

import React from "react";

interface FilterTabsProps {
  items: string[];
  activeItem: string;
  onItemChange: (item: string) => void;
  variant?: "default" | "gray";
}

function FilterTabs({ items, activeItem, onItemChange, variant = "default" }: FilterTabsProps) {
  const getActiveClasses = (isActive: boolean) => {
    if (variant === "gray") {
      return isActive
        ? "border-stone-700 bg-stone-800 text-white shadow-sm"
        : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50";
    }
    return isActive
      ? "border-green-500 bg-green-500 text-white shadow-sm shadow-green-500/20"
      : "border-stone-200 bg-white text-stone-700 hover:border-green-200 hover:bg-green-50/60";
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 sm:gap-x-3">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onItemChange(item)}
          className={`min-h-10 whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 sm:min-h-11 sm:px-4 sm:text-sm ${getActiveClasses(activeItem === item)}`}
          aria-pressed={activeItem === item}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default FilterTabs;
