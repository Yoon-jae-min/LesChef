"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { checkLoginStatus } from "@/utils/helpers/authUtils";
import { type RecipeListItem } from "@/utils/api/recipeApi";
import {
  getThumbnailPath,
  generateImagePlaceholder,
  resolveBackendAssetUrl,
} from "@/utils/helpers/imageUtils";

interface RecipeCardProps {
  recipe: RecipeListItem;
}

/**
 * 레시피 카드 컴포넌트 (클라이언트 컴포넌트)
 * 로그인 상태에 따라 다른 UI 표시
 */
export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(checkLoginStatus());
  }, []);

  const cookTimeLabel = recipe.cookTime ? `${recipe.cookTime}분` : "시간 정보 없음";
  const levelLabel = recipe.cookLevel || "난이도 정보 없음";
  const tags = [recipe.subCategory || recipe.majorCategory || "레시피"];
  const recipeId = recipe._id || "";
  const recipeImgUrl = recipe.recipeImg ? resolveBackendAssetUrl(recipe.recipeImg) : "";

  return (
    <Link
      key={recipeId || recipe.recipeName}
      href={recipeId ? `/recipe/detail?id=${recipeId}` : "/recipe"}
      className="group flex flex-col rounded-[28px] border border-stone-200/90 bg-white p-5 shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.03] transition duration-200 hover:-translate-y-0.5 hover:border-orange-200/80 hover:shadow-md hover:shadow-orange-900/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
      aria-label={`${recipe.recipeName} 상세로 이동`}
    >
      <div className="relative overflow-hidden rounded-[22px] border border-stone-200/80 bg-stone-50">
        <div className="relative aspect-[5/3] w-full bg-gradient-to-br from-white to-stone-100">
          {recipe.recipeImg ? (
            <Image
              src={recipeImgUrl}
              alt={recipe.recipeName}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-opacity duration-300"
              loading="lazy"
              placeholder="blur"
              blurDataURL={generateImagePlaceholder(400, 240)}
              onError={(e) => {
                // 썸네일 로드 실패 시 원본 이미지로 폴백
                const target = e.target as HTMLImageElement;
                const thumbnailPath = recipe.recipeImg
                  ? resolveBackendAssetUrl(getThumbnailPath(recipe.recipeImg))
                  : "";
                if (recipeImgUrl && target.src !== recipeImgUrl && thumbnailPath) {
                  target.src = recipeImgUrl;
                }
              }}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-stone-400">
              <span className="text-3xl" aria-hidden>
                📷
              </span>
              <span>레시피 이미지</span>
            </div>
          )}
        </div>
      </div>

      {isLoggedIn ? (
        <div className="relative mt-4 flex items-center justify-between rounded-[22px] border border-stone-200/90 bg-gradient-to-br from-orange-50/50 via-white to-stone-50 px-5 py-5">
          <span className="text-4xl" aria-hidden>
            🍳
          </span>
          <div className="text-right text-stone-900">
            <p className="text-xs uppercase tracking-[0.35em] text-stone-500">View</p>
            <p className="text-3xl font-semibold tabular-nums">{recipe.viewCount ?? 0}</p>
            <p className="text-xs text-stone-600">조회수</p>
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-[22px] border border-white/60" />
        </div>
      ) : (
        <div className="mt-4 rounded-[22px] border border-dashed border-stone-200 bg-stone-50/80 px-5 py-4 text-xs text-stone-600">
          로그인하면 내 재료와의 매칭 정도를 확인할 수 있어요.
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-stone-500">
        <span className="rounded-full bg-stone-100 px-3 py-1 font-medium text-stone-700">
          {levelLabel}
        </span>
        <span className="font-medium text-stone-800">{cookTimeLabel}</span>
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug text-stone-900 sm:text-xl">
        {recipe.recipeName}
      </h3>

      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-stone-200/90 bg-stone-50/50 px-3 py-1 text-xs text-stone-600"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-stone-500">
        <span>레시피 상세 보기</span>
        <span className="font-semibold text-orange-600 transition-colors group-hover:text-orange-700" aria-hidden>
          →
        </span>
      </div>
    </Link>
  );
}
