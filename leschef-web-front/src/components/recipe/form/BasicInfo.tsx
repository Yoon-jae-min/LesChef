/**
 * 레시피 기본 정보 섹션 컴포넌트
 * 레시피 작성/수정 페이지에서 공통으로 사용
 */

import Image from "next/image";
import { RECIPE_OPTIONS } from "@/constants/recipe/recipe";

interface BasicInfoProps {
  recipeName: string;
  cookTime: number;
  portion: number;
  portionUnit: string;
  cookLevel: string;
  majorCategory: string;
  subCategory: string;
  recipeImgPreview: string;
  onRecipeNameChange: (value: string) => void;
  onCookTimeChange: (value: number) => void;
  onPortionChange: (value: number) => void;
  onPortionUnitChange: (value: string) => void;
  onCookLevelChange: (value: string) => void;
  onMajorCategoryChange: (value: string) => void;
  onSubCategoryChange: (value: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BasicInfo({
  recipeName,
  cookTime,
  portion,
  portionUnit,
  cookLevel,
  majorCategory,
  subCategory,
  recipeImgPreview,
  onRecipeNameChange,
  onCookTimeChange,
  onPortionChange,
  onPortionUnitChange,
  onCookLevelChange,
  onMajorCategoryChange,
  onSubCategoryChange,
  onImageChange,
}: BasicInfoProps) {
  return (
    <section className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">기본 정보</h2>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            레시피 이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={recipeName}
            onChange={(e) => onRecipeNameChange(e.target.value)}
            placeholder="예) 김치볶음밥"
            className={`w-full rounded-2xl border px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-0 ${
              recipeName.trim().length === 0
                ? "border-red-300 focus:border-red-500"
                : "border-gray-200 focus:border-gray-400"
            }`}
            required
          />
          {recipeName.trim().length === 0 && (
            <p className="mt-1 text-xs text-red-600">레시피 이름은 필수입니다.</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">조리 시간 (분)</label>
            <input
              type="number"
              value={cookTime}
              onChange={(e) => onCookTimeChange(Number(e.target.value))}
              min={1}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-gray-400 focus:ring-0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">난이도</label>
            <select
              value={cookLevel}
              onChange={(e) => onCookLevelChange(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-gray-400 focus:ring-0"
            >
              {RECIPE_OPTIONS.COOK_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">분량</label>
            <input
              type="number"
              value={portion}
              onChange={(e) => onPortionChange(Number(e.target.value))}
              min={1}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-gray-400 focus:ring-0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">단위</label>
            <select
              value={portionUnit}
              onChange={(e) => onPortionUnitChange(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-gray-400 focus:ring-0"
            >
              {RECIPE_OPTIONS.PORTION_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
            <select
              value={majorCategory}
              onChange={(e) => onMajorCategoryChange(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-gray-400 focus:ring-0"
            >
              {RECIPE_OPTIONS.MAJOR_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">세부 카테고리</label>
            <input
              type="text"
              value={subCategory}
              onChange={(e) => onSubCategoryChange(e.target.value)}
              placeholder="예) 볶음, 찜, 구이"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">대표 이미지</label>
          <div className="space-y-3">
            {recipeImgPreview ? (
              <div className="relative w-full h-64 rounded-2xl border border-gray-200 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                <Image
                  src={recipeImgPreview}
                  alt="레시피 미리보기"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="relative w-full h-64 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                  <span className="text-4xl">📷</span>
                  <span className="text-sm">이미지를 업로드하세요</span>
                </div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-gray-400 focus:ring-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

