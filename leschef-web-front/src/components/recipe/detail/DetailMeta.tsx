/**
 * 레시피 상세 메타데이터 섹션 컴포넌트
 * 제목, 이미지, 카테고리/분량/조리시간 정보
 */

import Link from "next/link";
import Image from "next/image";
import { generateImagePlaceholder, resolveBackendAssetUrl } from "@/utils/helpers/imageUtils";
import type { RecipeDetailResponse } from "@/types/recipe";

interface DetailMetaProps {
  recipeMeta: RecipeDetailResponse["selectedRecipe"] | undefined;
  recipeId: string;
  canEdit: boolean;
  isLiked: boolean;
  onToggleWish: () => void;
}

export default function DetailMeta({
  recipeMeta,
  recipeId,
  canEdit,
  isLiked,
  onToggleWish,
}: DetailMetaProps) {
  const recipeImgUrl = recipeMeta?.recipeImg ? resolveBackendAssetUrl(recipeMeta.recipeImg) : "";

  return (
    <div className="space-y-6 lg:overflow-y-auto lg:pr-2">
      {/* 레시피 제목 */}
      <div className="flex flex-col gap-4 rounded-[28px] border border-stone-200/90 bg-white/95 p-5 shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.04] sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-green-600/90">Recipe</p>
          <h1 className="mt-1 text-3xl font-bold leading-tight tracking-tight text-stone-900 sm:text-4xl">
            {recipeMeta?.recipeName || "레시피"}
          </h1>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
          {canEdit && recipeId && (
            <Link
              href={`/myPage/recipes/edit?id=${recipeId}`}
              className="rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-green-200 hover:bg-green-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
            >
              편집
            </Link>
          )}

          <button
            type="button"
            onClick={onToggleWish}
            aria-label={isLiked ? "찜 해제" : "찜하기"}
            aria-pressed={isLiked}
            className={`inline-flex h-10 items-center gap-1.5 rounded-xl border px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 ${
              isLiked
                ? "border-green-600 bg-green-600 text-white"
                : "border-green-600 bg-white text-green-700 hover:bg-green-50"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
              aria-hidden
            >
              <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" />
            </svg>
            찜
          </button>
        </div>
      </div>

      {/* 레시피 이미지 */}
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[28px] border border-stone-200/90 bg-gradient-to-br from-stone-100 to-stone-200 shadow-md shadow-stone-900/5 ring-1 ring-stone-900/[0.03]">
        {recipeMeta?.recipeImg ? (
          <Image
            src={recipeImgUrl}
            alt={recipeMeta.recipeName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-opacity duration-300"
            priority
            placeholder="blur"
            blurDataURL={generateImagePlaceholder(600, 600)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-stone-400">
            <span className="text-5xl" aria-hidden>
              📷
            </span>
            <span className="text-sm">레시피 이미지</span>
          </div>
        )}
      </div>

      {/* 레시피 메타데이터 */}
      <div className="flex w-full items-center justify-center rounded-[28px] border border-green-100/90 bg-gradient-to-br from-green-50/90 via-amber-50/50 to-white px-3 py-5 shadow-sm sm:px-6 sm:py-6">
        <div className="grid w-full max-w-xl grid-cols-1 gap-4 text-center font-semibold text-stone-900 sm:max-w-none sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-green-200/80">
          <span className="text-sm sm:px-4 sm:text-base lg:text-lg">
            {(recipeMeta?.majorCategory || "카테고리") +
              (recipeMeta?.subCategory ? ` · ${recipeMeta.subCategory}` : "")}
          </span>
          <span className="text-sm sm:px-4 sm:text-base lg:text-lg">
            {recipeMeta?.portion
              ? `${recipeMeta.portion}${recipeMeta.portionUnit || "인분"}`
              : "분량 정보 없음"}
          </span>
          <span className="text-sm sm:px-4 sm:text-base lg:text-lg">
            {recipeMeta?.cookTime ? `${recipeMeta.cookTime}분` : "시간 정보 없음"}
          </span>
        </div>
      </div>
    </div>
  );
}
