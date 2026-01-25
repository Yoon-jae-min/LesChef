/**
 * 레시피 상세 조리 단계 섹션 컴포넌트
 */

import Image from "next/image";
import { generateImagePlaceholder } from "@/utils/helpers/imageUtils";
import type { RecipeDetailResponse } from "@/types/recipe";

interface DetailStepsProps {
  steps: RecipeDetailResponse["recipeSteps"];
}

export default function DetailSteps({ steps }: DetailStepsProps) {
  if (steps.length === 0) {
    return (
      <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
        <h2 className="text-2xl font-bold text-black pb-1 mb-4 text-center">
          <span className="border-b-2 border-gray-300 px-1">Step</span>
        </h2>
        <div className="text-center text-sm text-gray-500 py-4">조리 단계가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
      <h2 className="text-2xl font-bold text-black pb-1 mb-4 text-center">
        <span className="border-b-2 border-gray-300 px-1">Step</span>
      </h2>
      
      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.stepNum} className="border border-gray-200 rounded-2xl p-4 bg-gradient-to-br from-gray-50 to-white">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 relative flex-shrink-0 rounded-xl border border-gray-200 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {step.stepImg && step.stepImg !== "" ? (
                  <Image 
                    src={step.stepImg} 
                    alt={`step-${step.stepNum}`} 
                    fill
                    sizes="96px"
                    className="object-cover transition-opacity duration-300"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={generateImagePlaceholder(96, 96)}
                  />
                ) : (
                  <span className="text-2xl text-gray-400">📷</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-black mb-3">Step. {step.stepNum}</h3>
                <div className="w-full min-h-[60px] border-2 border-dashed border-gray-300 rounded-xl flex items-center px-4 bg-white">
                  <span className="text-gray-700 text-base">{step.stepWay || "내용"}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

