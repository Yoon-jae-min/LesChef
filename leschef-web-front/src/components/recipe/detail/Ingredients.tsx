/**
 * 레시피 상세 재료 섹션 컴포넌트
 */

import type { RecipeDetailResponse } from "@/types/recipe";

interface IngredientsProps {
  ingredients: RecipeDetailResponse["recipeIngres"];
}

export default function Ingredients({
  ingredients,
}: IngredientsProps) {
  if (ingredients.length === 0) {
    return (
      <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
        <h2 className="text-2xl font-bold text-black pb-1 mb-4 text-center">
          <span className="border-b-2 border-gray-300 px-1">Ingredient</span>
        </h2>
        <div className="text-center text-sm text-gray-500 py-4">재료 정보가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
      <h2 className="text-2xl font-bold text-black pb-1 mb-4 text-center">
        <span className="border-b-2 border-gray-300 px-1">Ingredient</span>
      </h2>
      
      {ingredients.map((group, idx) => (
        <div key={`${group.sortType}-${idx}`} className="mb-6 last:mb-0">
          <button className="px-4 py-2 text-gray-700 rounded-2xl text-base font-medium mb-4 border border-gray-300 bg-white hover:bg-gray-50 transition-colors">
            {group.sortType || "재료"}
          </button>
          <div className="space-y-3 pl-4">
            {group.ingredientUnit.map((item, i) => (
              <div
                key={`${item.ingredientName}-${i}`}
                className="flex items-center justify-between text-base rounded-xl border border-gray-200 bg-gray-50 px-4 py-2"
              >
                <div className="text-gray-900 font-medium">{item.ingredientName}</div>
                <div className="flex items-center space-x-6">
                  <div className="text-gray-900 font-medium">{item.volume}</div>
                  <div className="text-gray-900 font-medium">{item.unit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

