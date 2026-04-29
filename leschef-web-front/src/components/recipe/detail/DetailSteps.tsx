/**
 * 레시피 상세 조리 단계 섹션 컴포넌트
 */

import Image from "next/image";
import { generateImagePlaceholder, resolveBackendAssetUrl } from "@/utils/helpers/imageUtils";
import type { RecipeDetailResponse } from "@/types/recipe";

interface DetailStepsProps {
  steps: RecipeDetailResponse["recipeSteps"];
}

const sectionShell =
  "rounded-[28px] border border-stone-200/90 bg-white/95 p-5 shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.03] sm:p-6";

export default function DetailSteps({ steps }: DetailStepsProps) {
  if (steps.length === 0) {
    return (
      <section className={sectionShell} aria-labelledby="recipe-steps-heading">
        <h2
          id="recipe-steps-heading"
          className="mb-4 text-center text-xl font-bold tracking-tight text-stone-900 sm:mb-5 sm:text-2xl"
        >
          <span className="inline-block border-b-2 border-orange-400/80 pb-1">조리 순서</span>
        </h2>
        <p className="py-4 text-center text-sm text-stone-500">조리 단계가 없습니다.</p>
      </section>
    );
  }

  return (
    <section className={sectionShell} aria-labelledby="recipe-steps-heading">
      <h2
        id="recipe-steps-heading"
        className="mb-5 text-center text-xl font-bold tracking-tight text-stone-900 sm:text-2xl"
      >
        <span className="inline-block border-b-2 border-orange-400/80 pb-1">조리 순서</span>
      </h2>

      <ol className="space-y-4">
        {steps.map((step) => (
          <li
            key={step.stepNum}
            className="rounded-2xl border border-stone-200/80 bg-gradient-to-br from-stone-50/80 to-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
              <div className="relative mx-auto h-28 w-full max-w-[11rem] shrink-0 overflow-hidden rounded-xl border border-stone-200/90 bg-gradient-to-br from-stone-100 to-stone-200 sm:mx-0 sm:h-24 sm:w-24">
                {step.stepImg && step.stepImg !== "" ? (
                  <Image
                    src={resolveBackendAssetUrl(step.stepImg)}
                    alt={`${step.stepNum}단계 조리 이미지`}
                    fill
                    sizes="112px"
                    className="object-cover transition-opacity duration-300"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={generateImagePlaceholder(96, 96)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-2xl text-stone-400" aria-hidden>
                      📷
                    </span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-stone-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-800">
                    {step.stepNum}
                  </span>
                  <span>단계</span>
                </h3>
                <div className="min-h-[3.5rem] rounded-xl border border-dashed border-stone-200 bg-white px-4 py-3">
                  <p className="text-base leading-relaxed text-stone-700">{step.stepWay || "내용"}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
