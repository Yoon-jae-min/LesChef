/**
 * 레시피 조리 단계 섹션 컴포넌트
 * 레시피 작성/수정 페이지에서 공통으로 사용
 */

import type { RecipeStep } from "@/utils/api/recipeApi";

interface StepProps {
  steps: RecipeStep[];
  onAddStep: () => void;
  onRemoveStep: (index: number) => void;
  onUpdateStep: (index: number, field: "stepWay" | "stepImg", value: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>, stepIndex: number) => void;
}

export default function Step({
  steps,
  onAddStep,
  onRemoveStep,
  onUpdateStep,
  onImageChange,
}: StepProps) {
  const inputClass =
    "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-500 transition focus:outline-none focus-visible:border-orange-400 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2";
  const fileClass = `${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-orange-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-orange-800 hover:file:bg-orange-100`;

  return (
    <section
      className="rounded-[28px] border border-stone-200/90 bg-white/95 p-6 shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.03] sm:p-8"
      aria-labelledby="recipe-form-steps-heading"
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="recipe-form-steps-heading" className="text-xl font-bold tracking-tight text-stone-900">
          조리 단계 <span className="text-red-500">*</span>
        </h2>
        <button
          type="button"
          onClick={onAddStep}
          className="rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-orange-200 hover:bg-orange-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        >
          단계 추가
        </button>
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="rounded-2xl border border-stone-200/80 bg-stone-50/50 p-4 sm:p-5"
          >
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white shadow-sm">
                {step.stepNum}
              </span>
              <h3 className="text-base font-semibold text-stone-900">단계</h3>
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveStep(index)}
                  className="ml-auto rounded-xl border border-red-200 bg-white px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
                >
                  삭제
                </button>
              )}
            </div>

            <div className="space-y-3">
              <textarea
                value={step.stepWay}
                onChange={(e) => onUpdateStep(index, "stepWay", e.target.value)}
                placeholder="조리 방법을 입력하세요..."
                rows={4}
                className={inputClass}
                required
              />
              <div>
                {step.stepImg ? (
                  <div className="relative mb-2 h-48 w-full overflow-hidden rounded-xl border border-stone-200/90 bg-gradient-to-br from-stone-50 to-stone-100">
                    <img
                      src={step.stepImg}
                      alt={`단계 ${step.stepNum}`}
                      className="block h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="relative mb-2 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-stone-300 bg-gradient-to-br from-stone-50 to-orange-50/30">
                    <div className="flex flex-col items-center justify-center gap-2 text-stone-400">
                      <span className="text-3xl" aria-hidden>
                        📷
                      </span>
                      <span className="text-xs">이미지를 업로드하세요</span>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onImageChange(e, index)}
                  className={fileClass}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
