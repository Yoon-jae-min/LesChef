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
      <div className="flex items-center justify-between rounded-[32px] border border-gray-200 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
        <h1 className="text-4xl font-bold text-black">{recipeMeta?.recipeName || "레시피"}</h1>

        <div className="flex items-center gap-3">
          {/* 편집 버튼 - 로그인하고 작성자인 경우에만 표시 */}
          {canEdit && recipeId && (
            <Link
              href={`/myPage/recipes/edit?id=${recipeId}`}
              className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
            >
              편집
            </Link>
          )}

          {/* 좋아요 버튼 */}
          <button
            onClick={onToggleWish}
            className={`w-8 h-8 flex items-center justify-center transition-colors ${
              isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6"
            >
              <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 레시피 이미지 */}
      <div className="w-full aspect-square relative rounded-[32px] border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden shadow-[6px_6px_0_rgba(0,0,0,0.05)] flex items-center justify-center">
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
          <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
            <span className="text-5xl">📷</span>
            <span className="text-sm">레시피 이미지</span>
          </div>
        )}
      </div>

      {/* 레시피 메타데이터 */}
      <div className="w-full flex items-center justify-center py-4 rounded-[32px] border border-gray-200 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
        <div className="flex items-center space-x-6 sm:space-x-10 lg:space-x-12 text-base sm:text-lg lg:text-xl font-bold text-black">
          <span>
            {(recipeMeta?.majorCategory || "카테고리") +
              (recipeMeta?.subCategory ? ` > ${recipeMeta.subCategory}` : "")}
          </span>
          <div className="h-8 sm:h-10 lg:h-12 border-l border-gray-300"></div>
          <span>
            {recipeMeta?.portion
              ? `${recipeMeta.portion}${recipeMeta.portionUnit || "인분"}`
              : "분량 정보 없음"}
          </span>
          <div className="h-8 sm:h-10 lg:h-12 border-l border-gray-300"></div>
          <span>{recipeMeta?.cookTime ? `${recipeMeta.cookTime}분` : "시간 정보 없음"}</span>
        </div>
      </div>
    </div>
  );
}
