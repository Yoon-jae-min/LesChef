/**
 * 레시피 상세 재료 섹션 컴포넌트
 */

import type { ReactNode } from "react";
import type { RecipeDetailResponse } from "@/types/recipe";

interface IngredientsProps {
  ingredients: RecipeDetailResponse["recipeIngres"];
}

const sectionShell =
  "rounded-[28px] border border-stone-200/90 bg-white/95 p-5 shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.03] sm:p-6";

function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="mb-5 text-center text-xl font-bold tracking-tight text-stone-900 sm:text-2xl"
    >
      <span className="inline-block border-b-2 border-orange-400/80 pb-1">{children}</span>
    </h2>
  );
}

export default function Ingredients({ ingredients }: IngredientsProps) {
  if (ingredients.length === 0) {
    return (
      <section className={sectionShell} aria-labelledby="recipe-ingredients-heading">
        <SectionTitle id="recipe-ingredients-heading">재료</SectionTitle>
        <p className="py-4 text-center text-sm text-stone-500">재료 정보가 없습니다.</p>
      </section>
    );
  }

  return (
    <section className={sectionShell} aria-labelledby="recipe-ingredients-heading">
      <SectionTitle id="recipe-ingredients-heading">재료</SectionTitle>

      {ingredients.map((group, idx) => (
        <div key={`${group.sortType}-${idx}`} className="mb-6 last:mb-0">
          <p className="mb-3 inline-flex rounded-2xl border border-orange-100 bg-orange-50/80 px-4 py-2 text-sm font-semibold text-stone-800">
            {group.sortType || "재료"}
          </p>
          <ul className="space-y-2 sm:space-y-3 sm:pl-1">
            {group.ingredientUnit.map((item, i) => (
              <li
                key={`${item.ingredientName}-${i}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-stone-200/80 bg-stone-50/50 px-4 py-3 text-base"
              >
                <span className="min-w-0 flex-1 font-medium text-stone-900">{item.ingredientName}</span>
                {item.amountText?.trim() ? (
                  <span className="tabular-nums font-medium text-stone-800">{item.amountText}</span>
                ) : (
                  <span className="flex items-center gap-4 tabular-nums">
                    <span className="font-medium text-stone-800">{item.volume}</span>
                    <span className="min-w-[3rem] text-right font-medium text-stone-700">{item.unit}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
