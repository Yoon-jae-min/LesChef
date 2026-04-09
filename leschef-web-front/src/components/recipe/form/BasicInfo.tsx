/**
 * 레시피 기본 정보 섹션 컴포넌트
 * 레시피 작성/수정 페이지에서 공통으로 사용
 */

import { useEffect } from "react";
import { RECIPE_OPTIONS, RECIPE_SUBCATEGORIES_BY_MAJOR } from "@/constants/recipe/recipe";

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
  const subCategoryOptions =
    RECIPE_SUBCATEGORIES_BY_MAJOR[
      majorCategory as keyof typeof RECIPE_SUBCATEGORIES_BY_MAJOR
    ] ?? RECIPE_SUBCATEGORIES_BY_MAJOR["한식"];

  useEffect(() => {
    const opts =
      RECIPE_SUBCATEGORIES_BY_MAJOR[
        majorCategory as keyof typeof RECIPE_SUBCATEGORIES_BY_MAJOR
      ] ?? RECIPE_SUBCATEGORIES_BY_MAJOR["한식"];
    if (!opts.includes(subCategory)) {
      onSubCategoryChange(opts[0] ?? "전체");
    }
  }, [majorCategory, subCategory, onSubCategoryChange]);

  const fieldBase =
    "w-full rounded-2xl border px-4 py-3 text-sm text-stone-900 placeholder:text-stone-500 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const fieldNormal = `${fieldBase} border-stone-200 focus-visible:border-orange-400 focus-visible:ring-orange-500`;
  const fieldError = `${fieldBase} border-red-300 focus-visible:border-red-500 focus-visible:ring-red-400`;

  return (
    <section
      className="rounded-[28px] border border-stone-200/90 bg-white/95 p-6 shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.03] sm:p-8"
      aria-labelledby="recipe-form-basic-heading"
    >
      <h2 id="recipe-form-basic-heading" className="mb-6 text-xl font-bold tracking-tight text-stone-900">
        기본 정보
      </h2>
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            레시피 이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={recipeName}
            onChange={(e) => onRecipeNameChange(e.target.value)}
            placeholder="예) 김치볶음밥"
            className={recipeName.trim().length === 0 ? fieldError : fieldNormal}
            required
          />
          {recipeName.trim().length === 0 && (
            <p className="mt-1 text-xs text-red-600">레시피 이름은 필수입니다.</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">조리 시간 (분)</label>
            <input
              type="number"
              value={cookTime}
              onChange={(e) => onCookTimeChange(Number(e.target.value))}
              min={1}
              className={fieldNormal}
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">난이도</label>
            <select
              value={cookLevel}
              onChange={(e) => onCookLevelChange(e.target.value)}
              className={`${fieldNormal} cursor-pointer bg-white`}
            >
              {RECIPE_OPTIONS.COOK_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">분량</label>
            <input
              type="number"
              value={portion}
              onChange={(e) => onPortionChange(Number(e.target.value))}
              min={1}
              className={fieldNormal}
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">단위</label>
            <select
              value={portionUnit}
              onChange={(e) => onPortionUnitChange(e.target.value)}
              className={`${fieldNormal} cursor-pointer bg-white`}
            >
              {RECIPE_OPTIONS.PORTION_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">카테고리</label>
            <select
              value={majorCategory}
              onChange={(e) => {
                const nextMajor = e.target.value;
                onMajorCategoryChange(nextMajor);
                const subs =
                  RECIPE_SUBCATEGORIES_BY_MAJOR[
                    nextMajor as keyof typeof RECIPE_SUBCATEGORIES_BY_MAJOR
                  ] ?? RECIPE_SUBCATEGORIES_BY_MAJOR["한식"];
                onSubCategoryChange(subs[0] ?? "전체");
              }}
              className={`${fieldNormal} cursor-pointer bg-white`}
            >
              {RECIPE_OPTIONS.MAJOR_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">세부 카테고리</label>
            <select
              value={subCategory}
              onChange={(e) => onSubCategoryChange(e.target.value)}
              className={`${fieldNormal} cursor-pointer bg-white`}
            >
              {subCategoryOptions.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">대표 이미지</label>
          <div className="space-y-3">
            {recipeImgPreview ? (
              <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-stone-200/90 bg-gradient-to-br from-stone-50 to-stone-100">
                {/* 박스 크기는 고정, 이미지가 비율 유지하며 안에 다 들어오도록 */}
                <img
                  src={recipeImgPreview}
                  alt="레시피 미리보기"
                  className="block h-full w-full object-contain"
                />
              </div>
            ) : (
              <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-stone-300 bg-gradient-to-br from-stone-50 to-orange-50/30">
                <div className="flex flex-col items-center justify-center gap-2 text-stone-400">
                  <span className="text-4xl" aria-hidden>
                    📷
                  </span>
                  <span className="text-sm">이미지를 업로드하세요</span>
                </div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className={`${fieldNormal} file:mr-3 file:rounded-lg file:border-0 file:bg-orange-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-orange-800 hover:file:bg-orange-100`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
