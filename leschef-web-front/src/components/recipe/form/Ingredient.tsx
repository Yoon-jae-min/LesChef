/**
 * 레시피 재료 섹션 컴포넌트
 * 레시피 작성/수정 페이지에서 공통으로 사용
 */

import type { IngredientGroup } from "@/utils/api/recipeApi";
import { RECIPE_DEFAULTS } from "@/constants/recipe/recipe";

interface IngredientProps {
  ingredientGroups: IngredientGroup[];
  onAddGroup: () => void;
  onAddIngredient: (groupIndex: number) => void;
  onRemoveIngredient: (groupIndex: number, ingredientIndex: number) => void;
  onUpdateGroupType: (groupIndex: number, sortType: string) => void;
  onUpdateIngredient: (
    groupIndex: number,
    ingredientIndex: number,
    field: "ingredientName" | "volume" | "unit",
    value: string | number
  ) => void;
}

export default function Ingredient({
  ingredientGroups,
  onAddGroup,
  onAddIngredient,
  onRemoveIngredient,
  onUpdateGroupType,
  onUpdateIngredient,
}: IngredientProps) {
  return (
    <section className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          재료 <span className="text-red-500">*</span>
        </h2>
        <button
          type="button"
          onClick={onAddGroup}
          className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
        >
          재료 그룹 추가
        </button>
      </div>

      <div className="space-y-6">
        {ingredientGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="text"
                value={group.sortType}
                onChange={(e) => onUpdateGroupType(groupIndex, e.target.value)}
                placeholder="예) 주재료, 양념"
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
              />
              <button
                type="button"
                onClick={() => onAddIngredient(groupIndex)}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-white transition"
              >
                재료 추가
              </button>
            </div>

            <div className="space-y-3">
              {group.ingredients.map((ingredient, ingredientIndex) => (
                <div key={ingredientIndex} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={ingredient.ingredientName}
                    onChange={(e) =>
                      onUpdateIngredient(
                        groupIndex,
                        ingredientIndex,
                        "ingredientName",
                        e.target.value
                      )
                    }
                    placeholder="재료명"
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
                  />
                  <input
                    type="number"
                    value={ingredient.volume}
                    onChange={(e) =>
                      onUpdateIngredient(
                        groupIndex,
                        ingredientIndex,
                        "volume",
                        Number(e.target.value)
                      )
                    }
                    placeholder="수량"
                    min={0}
                    step={0.1}
                    className="w-24 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-gray-400 focus:ring-0"
                  />
                  <input
                    type="text"
                    value={ingredient.unit}
                    onChange={(e) =>
                      onUpdateIngredient(groupIndex, ingredientIndex, "unit", e.target.value)
                    }
                    placeholder="단위"
                    className="w-20 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveIngredient(groupIndex, ingredientIndex)}
                    className="rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
