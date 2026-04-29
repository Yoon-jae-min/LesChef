/**
 * 레시피 재료 섹션 컴포넌트
 * 레시피 작성/수정 페이지에서 공통으로 사용
 */

import { useMemo, useState } from "react";
import type { IngredientGroup } from "@/utils/api/recipeApi";

interface IngredientProps {
  ingredientGroups: IngredientGroup[];
  onAddGroup: () => void;
  onAddIngredient: (groupIndex: number) => void;
  onRemoveIngredient: (groupIndex: number, ingredientIndex: number) => void;
  onUpdateGroupType: (groupIndex: number, sortType: string) => void;
  onUpdateIngredient: (
    groupIndex: number,
    ingredientIndex: number,
    field: "ingredientName" | "volume" | "unit" | "amountText",
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
  const inputClass =
    "rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-500 transition focus:outline-none focus-visible:border-orange-400 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2";

  /**
   * 수량(volume) UX:
   * - 포커스 중에는 빈 값("") 허용
   * - 값이 0인 상태에서 포커스하면 기본 0을 지워서 바로 입력 가능
   * - 빈 값 상태로 blur 하면 0으로 복구
   */
  const [draftVolumes, setDraftVolumes] = useState<Record<string, string>>({});
  const draftKey = useMemo(
    () => (groupIndex: number, ingredientIndex: number) => `${groupIndex}:${ingredientIndex}`,
    []
  );

  const quickAmountTexts = useMemo(
    () => ["약간", "적당량", "기호에 따라", "한 줌"] as const,
    []
  );

  return (
    <section
      className="rounded-[28px] border border-stone-200/90 bg-white/95 p-6 shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.03] sm:p-8"
      aria-labelledby="recipe-form-ingredients-heading"
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="recipe-form-ingredients-heading" className="text-xl font-bold tracking-tight text-stone-900">
          재료 <span className="text-red-500">*</span>
        </h2>
        <button
          type="button"
          onClick={onAddGroup}
          className="rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-orange-200 hover:bg-orange-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        >
          재료 그룹 추가
        </button>
      </div>

      <div className="space-y-6">
        {ingredientGroups.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className="rounded-2xl border border-stone-200/80 bg-stone-50/50 p-4 sm:p-5"
          >
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="text"
                value={group.sortType}
                onChange={(e) => onUpdateGroupType(groupIndex, e.target.value)}
                placeholder="예) 주재료, 양념"
                className={`min-w-0 flex-1 ${inputClass}`}
              />
              <button
                type="button"
                onClick={() => onAddIngredient(groupIndex)}
                className="shrink-0 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-900 transition hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                재료 추가
              </button>
            </div>

            <div className="space-y-3">
              {group.ingredients.map((ingredient, ingredientIndex) => (
                (() => {
                  const isTextMode = Boolean(ingredient.amountText && ingredient.amountText.trim());
                  const k = draftKey(groupIndex, ingredientIndex);
                  return (
                <div
                  key={ingredientIndex}
                  className="flex flex-col gap-3 rounded-xl border border-stone-200/80 bg-white p-3 sm:flex-row sm:items-center sm:gap-3 sm:p-2 sm:pr-2"
                >
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
                    className={`min-w-0 flex-1 ${inputClass}`}
                  />
                  <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                    <div className="flex w-full items-center justify-between gap-2 sm:w-auto">
                      <div className="inline-flex overflow-hidden rounded-xl border border-stone-200 bg-white">
                        <button
                          type="button"
                          onClick={() => onUpdateIngredient(groupIndex, ingredientIndex, "amountText", "")}
                          className={`px-3 py-2 text-xs font-semibold transition ${
                            !isTextMode
                              ? "bg-orange-600 text-white"
                              : "bg-white text-stone-600 hover:bg-stone-50"
                          }`}
                        >
                          숫자
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!ingredient.amountText?.trim()) {
                              onUpdateIngredient(groupIndex, ingredientIndex, "amountText", "약간");
                            }
                          }}
                          className={`px-3 py-2 text-xs font-semibold transition ${
                            isTextMode
                              ? "bg-orange-600 text-white"
                              : "bg-white text-stone-600 hover:bg-stone-50"
                          }`}
                        >
                          약간
                        </button>
                      </div>
                    </div>

                    {isTextMode ? (
                      <div className="flex w-full flex-col gap-2 sm:w-auto">
                        <input
                          type="text"
                          value={ingredient.amountText ?? ""}
                          onChange={(e) =>
                            onUpdateIngredient(groupIndex, ingredientIndex, "amountText", e.target.value)
                          }
                          placeholder="예) 약간, 적당량, 기호에 따라"
                          className={`w-full sm:w-56 ${inputClass}`}
                        />
                        <div className="flex flex-wrap gap-1">
                          {quickAmountTexts.map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => onUpdateIngredient(groupIndex, ingredientIndex, "amountText", t)}
                              className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-900 hover:bg-orange-100"
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <input
                          type="number"
                          value={draftVolumes[k] ?? ingredient.volume}
                          onFocus={() => {
                            setDraftVolumes((prev) => {
                              if (prev[k] !== undefined) return prev; // 이미 편집 중이면 유지
                              return ingredient.volume === 0 ? { ...prev, [k]: "" } : prev;
                            });
                          }}
                          onChange={(e) =>
                            (() => {
                              const next = e.target.value; // "" | "0" | "0.5" ...
                              setDraftVolumes((prev) => ({ ...prev, [k]: next }));
                              if (next === "") return; // 포커스 중 빈 값 허용
                              onUpdateIngredient(groupIndex, ingredientIndex, "volume", Number(next));
                            })()
                          }
                          onBlur={() => {
                            const draft = draftVolumes[k];
                            if (draft === "") {
                              onUpdateIngredient(groupIndex, ingredientIndex, "volume", 0);
                            } else if (typeof draft === "string" && draft !== undefined) {
                              onUpdateIngredient(groupIndex, ingredientIndex, "volume", Number(draft));
                            }
                            setDraftVolumes((prev) => {
                              const { [k]: _, ...rest } = prev;
                              return rest;
                            });
                          }}
                          placeholder="수량"
                          min={0}
                          step={0.1}
                          className={`w-full tabular-nums sm:w-24 ${inputClass}`}
                        />
                        <input
                          type="text"
                          value={ingredient.unit}
                          onChange={(e) =>
                            onUpdateIngredient(groupIndex, ingredientIndex, "unit", e.target.value)
                          }
                          placeholder="단위"
                          className={`w-full sm:w-24 ${inputClass}`}
                        />
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemoveIngredient(groupIndex, ingredientIndex)}
                      className="w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 sm:ml-auto sm:w-auto"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                  );
                })()
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
