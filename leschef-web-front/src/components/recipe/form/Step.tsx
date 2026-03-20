/**
 * 레시피 조리 단계 섹션 컴포넌트
 * 레시피 작성/수정 페이지에서 공통으로 사용
 */

import Image from "next/image";
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
  return (
    <section className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          조리 단계 <span className="text-red-500">*</span>
        </h2>
        <button
          type="button"
          onClick={onAddStep}
          className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
        >
          단계 추가
        </button>
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-white text-sm font-semibold">
                {step.stepNum}
              </span>
              <h3 className="text-base font-semibold text-gray-900">단계 {step.stepNum}</h3>
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveStep(index)}
                  className="ml-auto rounded-xl border border-red-200 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 transition"
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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
                required
              />
              <div>
                {step.stepImg ? (
                  <div className="mb-2 relative w-full h-48 rounded-xl border border-gray-200 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    {/* 박스는 고정 높이, 이미지가 비율 유지하며 상자 안에 다 보이도록 */}
                    <img
                      src={step.stepImg}
                      alt={`단계 ${step.stepNum}`}
                      className="w-full h-full object-contain block"
                    />
                  </div>
                ) : (
                  <div className="mb-2 relative w-full h-48 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                      <span className="text-3xl">📷</span>
                      <span className="text-xs">이미지를 업로드하세요</span>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onImageChange(e, index)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-900 focus:border-gray-400 focus:ring-0"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
