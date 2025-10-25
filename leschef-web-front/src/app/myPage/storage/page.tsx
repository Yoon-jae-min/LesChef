"use client";

import { useState } from "react";
import FilterTabs from "@/components/common/FilterTabs";

export default function StoragePage() {
  // Sub-navigation for storage tab
  const [activePlace, setActivePlace] = useState("Place 1");
  const places = ["Place 1", "Place 2", "Place 3", "Place 4", "Place 5"];

  return (
    <div>
      {/* Place 탭 */}
      <div className="mb-4">
        <FilterTabs
          items={places}
          activeItem={activePlace}
          onItemChange={setActivePlace}
          variant="gray"
        />
      </div>

      {/* Storage Content */}
      <div>
        {/* Add item button */}
        <div className="flex justify-end mb-4">
          <button className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-600">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>

        {/* Storage items grid */}
        <div className="flex flex-wrap gap-6">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} style={{ width: 'calc((100% - 48px) / 3)', minWidth: '320px' }} className="border border-gray-300 p-2 flex items-center gap-2 hover:shadow-md transition-shadow rounded-lg">
              {/* Image */}
              <div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-gray-400 text-center">No Image</span>
              </div>
              
              {/* Left info */}
              <div className="flex-[0.6] min-w-0 h-20 flex items-center justify-center">
                <div className="text-base font-medium text-black">example</div>
              </div>
              
              {/* Separator line 1 */}
              <div className="w-px h-16 bg-gray-200 flex-shrink-0"></div>
              
              {/* Right info */}
              <div className="flex-[0.7] text-sm text-gray-600 h-20 flex flex-col items-center justify-center">
                <div>수량</div>
                <div>expire time</div>
              </div>

              {/* Separator line 2 */}
              <div className="w-px h-16 bg-gray-200 flex-shrink-0"></div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                {/* Edit button */}
                <button className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-600">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                
                {/* Delete button */}
                <button className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-600">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
