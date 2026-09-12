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
 * 레시피 카드 — 시트러스 시안 (이미지 · 메타 · 제목 · 태그 · 상세 CTA)
 * 로그인 시 조회수/매칭 안내 유지
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
  const href = recipeId ? `/recipe/detail?id=${recipeId}` : "/recipe";

  return (
    <article className="flex flex-col overflow-hidden rounded-[24px] border border-stone-200/90 bg-white shadow-sm shadow-stone-900/5 transition duration-200 hover:-translate-y-0.5 hover:border-green-200/80 hover:shadow-md hover:shadow-green-900/5">
      <Link
        href={href}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        aria-label={`${recipe.recipeName} 상세로 이동`}
      >
        <div className="relative aspect-[5/3] w-full overflow-hidden bg-stone-50">
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
              <span>레시피 이미지</span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>난이도: {levelLabel}</span>
          <span className="font-medium text-stone-700">{cookTimeLabel}</span>
        </div>

        <Link href={href} className="mt-2 block">
          <h3 className="text-lg font-semibold leading-snug text-stone-900 sm:text-xl">
            {recipe.recipeName}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs text-stone-600"
            >
              #{tag}
            </span>
          ))}
        </div>

        {isLoggedIn ? (
          <p className="mt-3 text-xs text-stone-500">
            조회수{" "}
            <span className="font-semibold tabular-nums text-stone-800">
              {recipe.viewCount ?? 0}
            </span>
          </p>
        ) : (
          <p className="mt-3 text-xs text-stone-500">
            로그인하면 내 재료와의 매칭 정도를 확인할 수 있어요.
          </p>
        )}

        <Link
          href={href}
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        >
          레시피 상세 보기
        </Link>
      </div>
    </article>
  );
}
