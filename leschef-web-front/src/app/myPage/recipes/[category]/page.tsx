"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchMyRecipeList, deleteRecipe, type MyRecipeListResponse } from "@/utils/recipeApi";

export default function MyRecipesCategoryPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<MyRecipeListResponse["list"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEditClick = (e: React.MouseEvent, recipeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/myPage/recipes/edit?id=${recipeId}`);
  };

  const handleDeleteClick = (e: React.MouseEvent, recipeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteTargetId(recipeId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;

    try {
      const response = await deleteRecipe(deleteTargetId);
      if (response.ok) {
        const result = await response.json();
        if (result.text === "success") {
          // 삭제 성공 시 리스트 새로고침
          const data = await fetchMyRecipeList();
          setRecipes(data.list || []);
          setShowDeleteConfirm(false);
          setDeleteTargetId(null);
        } else {
          throw new Error("레시피 삭제에 실패했습니다.");
        }
      } else {
        const text = await response.text();
        throw new Error(text || "레시피 삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("레시피 삭제 실패:", err);
      alert(err instanceof Error ? err.message : "레시피 삭제에 실패했습니다.");
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMyRecipeList();
        const list = data.list || [];
        setRecipes(list);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "나의 레시피를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {loading && (
        <div className="col-span-full flex items-center justify-center py-12 text-sm text-gray-500">
          나의 레시피를 불러오는 중입니다...
        </div>
      )}
      {error && !loading && (
        <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {!loading && !error && recipes.length === 0 && (
        <div className="col-span-full flex items-center justify-center py-12 text-sm text-gray-500">
          작성한 레시피가 없습니다.
        </div>
      )}

      {!loading && !error && recipes.map((card) => (
        <Link
          key={card._id}
          href={`/recipe/detail?id=${card._id}&recipeName=${encodeURIComponent(card.recipeName)}`}
          className="group flex flex-col rounded-[32px] border border-gray-200 bg-white p-5 shadow-[6px_6px_0_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label={`${card.title} 상세로 이동`}
        >
          <div className="relative overflow-hidden rounded-[24px] border border-gray-200 bg-gray-50">
            <div className="aspect-[5/3] w-full bg-gradient-to-br from-white to-gray-100">
              {card.recipeImg ? (
                <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${card.recipeImg})` }} />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-gray-400">
                  <span className="text-3xl">📷</span>
                  <span>레시피 이미지</span>
                </div>
              )}
            </div>
          </div>

          <div
            className={`relative mt-4 flex items-center justify-between rounded-[24px] border border-gray-200 bg-gradient-to-br from-gray-50 to-white px-5 py-6`}
          >
            <span className="text-4xl">🍳</span>
            <div className="text-right text-black">
              <p className="text-xs uppercase tracking-[0.4em] text-gray-600">My Recipe</p>
              <p className="text-3xl font-semibold">작성 레시피</p>
              <p className="text-xs text-gray-700">{card.subCategory || card.majorCategory || "나의 레시피"}</p>
            </div>
            <div className="absolute inset-0 rounded-[24px] border border-gray-200/10" />
          </div>

          <h3 className="mt-3 text-xl font-semibold text-gray-900">{card.recipeName}</h3>

          <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
            <div className="flex flex-wrap gap-2">
              {(card.subCategory ? [card.subCategory] : [card.majorCategory || "레시피"]).map((tag) => (
                <span key={tag} className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600">
                  #{tag}
                </span>
              ))}
            </div>
            <span className="rounded-full border px-3 py-1 text-xs font-semibold bg-green-50 text-green-600 border-green-200">
              작성 완료
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => handleEditClick(e, card._id)}
                className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
              >
                편집
              </button>
              <button
                onClick={(e) => handleDeleteClick(e, card._id)}
                className="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:border-red-300 hover:bg-red-50 transition"
              >
                삭제
              </button>
              <span className="text-[11px] text-gray-500">레시피 상세 보기</span>
            </div>
            <span className="font-semibold text-gray-800 text-[11px]">→</span>
          </div>
        </Link>
      ))}

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] border border-gray-200 p-8 max-w-md w-full shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
                레시피 삭제
              </h3>
              <p className="text-sm text-gray-600 mb-4 text-center">
                정말로 이 레시피를 삭제하시겠습니까?
              </p>
              <div className="rounded-2xl bg-red-50 border border-red-200 p-4 mb-4">
                <p className="text-sm text-red-800 font-medium mb-2">삭제 시 주의사항:</p>
                <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
                  <li>레시피 정보가 영구적으로 삭제됩니다</li>
                  <li>업로드한 이미지 파일도 함께 삭제됩니다</li>
                  <li>삭제된 레시피는 복구할 수 없습니다</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
              >
                취소
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 rounded-2xl border border-red-200 bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 transition"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
