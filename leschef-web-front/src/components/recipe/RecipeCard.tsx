"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { checkLoginStatus } from "@/utils/authUtils";
import { type RecipeListItem } from "@/utils/recipeApi";

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
  const recipeId = recipe._id || recipe.recipeName;

  return (
    <Link
      key={recipeId}
      href={`/recipe/detail?id=${recipeId}&recipeName=${encodeURIComponent(recipe.recipeName)}`}
      className="group flex flex-col rounded-[32px] border border-gray-200 bg-white p-5 shadow-[6px_6px_0_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-gray-300"
      aria-label={`${recipe.recipeName} 상세로 이동`}
    >
      <div className="relative overflow-hidden rounded-[24px] border border-gray-200 bg-gray-50">
        <div className="aspect-[5/3] w-full relative bg-gradient-to-br from-white to-gray-100">
          {recipe.recipeImg ? (
            <Image
              src={recipe.recipeImg}
              alt={recipe.recipeName}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-gray-400">
              <span className="text-3xl">📷</span>
              <span>레시피 이미지</span>
            </div>
          )}
        </div>
      </div>

      {isLoggedIn ? (
        <div className="relative mt-4 flex items-center justify-between rounded-[24px] border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 px-5 py-6">
          <span className="text-4xl">🍳</span>
          <div className="text-right text-black">
            <p className="text-xs uppercase tracking-[0.4em] text-gray-600">View</p>
            <p className="text-3xl font-semibold">{recipe.viewCount ?? 0}</p>
            <p className="text-xs text-gray-700">조회수</p>
          </div>
          <div className="absolute inset-0 rounded-[24px] border border-gray-200/30" />
        </div>
      ) : (
        <div className="mt-4 rounded-[24px] border border-dashed border-gray-200 bg-gray-50 px-5 py-4 text-xs text-gray-500">
          로그인하면 내 재료와의 매칭 정도를 확인할 수 있어요.
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-600">
          {levelLabel}
        </span>
        <span className="font-medium text-gray-800">{cookTimeLabel}</span>
      </div>

      <h3 className="mt-3 text-xl font-semibold text-gray-900">{recipe.recipeName}</h3>

      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-gray-500">
        <span>레시피 상세 보기</span>
        <span className="font-semibold text-gray-800">→</span>
      </div>
    </Link>
  );
}

