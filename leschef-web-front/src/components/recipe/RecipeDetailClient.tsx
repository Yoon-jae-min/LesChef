"use client";

import Top from "@/components/common/Top";
import ScrollToTop from "@/components/common/ScrollToTop";
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { fetchRecipeDetail, toggleRecipeWish, type RecipeDetailResponse } from "@/utils/recipeApi";
import { checkLoginStatus, getCurrentUserId } from "@/utils/authUtils";
import { TIMING } from "@/constants/timing";

interface RecipeDetailClientProps {
  recipeId: string;
  recipeNameParam: string;
  initialData?: RecipeDetailResponse | null;
  initialError?: string | null;
}

function RecipeDetailClient({ 
  recipeId, 
  recipeNameParam, 
  initialData, 
  initialError 
}: RecipeDetailClientProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      username: "아이디",
      time: "시간",
      content: "댓글 내용",
    },
    {
      id: 2,
      username: "아이디",
      time: "시간", 
      content: "댓글 내용",
    }
  ]);

  // 댓글 추가 핸들러 - useCallback으로 메모이제이션
  const handleAddComment = useCallback(() => {
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        username: "아이디",
        time: "시간",
        content: comment.trim(),
      };
      setComments(prev => [...prev, newComment]);
      setComment("");
    }
  }, [comment, comments.length]);

  // 댓글 삭제 핸들러 - useCallback으로 메모이제이션
  const handleDeleteComment = useCallback((id: number) => {
    setComments(prev => prev.filter(c => c.id !== id));
  }, []);

  // 로그인 상태 확인
  useEffect(() => {
    const checkLogin = () => {
      const loggedIn = checkLoginStatus();
      setIsLoggedIn(loggedIn);
      return loggedIn;
    };

    checkLogin();
    const onStorage = () => checkLogin();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // 레시피 상세 데이터 가져오기 - SWR 캐싱 적용
  // 서버에서 가져온 초기 데이터가 있으면 fallbackData로 사용
  const { data: detail, error: detailError, isLoading: loading, mutate } = useSWR<RecipeDetailResponse>(
    recipeNameParam ? ['recipe-detail', recipeNameParam] : null, // 레시피 이름이 있을 때만 fetch
    () => {
      if (!recipeNameParam) {
        throw new Error("레시피 이름이 없습니다.");
      }
      return fetchRecipeDetail(recipeNameParam);
    },
    {
      revalidateOnFocus: false,    // 포커스 시 재검증 안 함 (레시피 상세는 거의 변하지 않음)
      dedupingInterval: TIMING.TEN_MINUTES,    // 10분 동안 중복 요청 방지
      fallbackData: initialData || undefined, // 서버에서 가져온 초기 데이터 사용
    }
  );

  const error = detailError instanceof Error ? detailError.message : (initialError || null);
  const displayError = error || (initialError ? new Error(initialError) : null);

  // 작성자 확인 및 좋아요 상태 설정
  useEffect(() => {
    if (detail) {
      const currentUserId = getCurrentUserId();
      if (isLoggedIn && currentUserId && detail.selectedRecipe?.userId) {
        setIsAuthor(detail.selectedRecipe.userId === currentUserId);
      } else {
        setIsAuthor(false);
      }
      setIsLiked(detail.recipeWish || false);
    }
  }, [detail, isLoggedIn]);

  // 레시피 객체 ID - useMemo로 메모이제이션
  const recipeObjectId = useMemo(
    () => detail?.selectedRecipe?._id || recipeId || "",
    [detail?.selectedRecipe?._id, recipeId]
  );

  // Optimistic Updates 적용: 좋아요 기능 - useCallback으로 메모이제이션
  const handleToggleWish = useCallback(async () => {
    if (!recipeObjectId || !detail) {
      alert("레시피 ID가 없습니다.");
      return;
    }

    // 1. 즉시 UI 업데이트 (낙관적 업데이트)
    const previousData = detail;
    const newWishState = !detail.recipeWish;
    mutate(
      { ...detail, recipeWish: newWishState },
      false // 즉시 UI 업데이트, 서버 재검증 안 함
    );
    setIsLiked(newWishState);

    try {
      // 2. 백그라운드에서 실제 API 호출
      const result = await toggleRecipeWish(recipeObjectId);
      
      // 3. 서버 응답으로 최종 동기화
      mutate(
        { ...detail, recipeWish: result.recipeWish },
        false
      );
      setIsLiked(result.recipeWish);
    } catch (err) {
      // 4. 실패 시 이전 상태로 롤백
      mutate(previousData, false);
      setIsLiked(previousData.recipeWish || false);
      if (process.env.NODE_ENV === "development") {
        console.error("찜하기 실패:", err);
      }
      alert("찜하기에 실패했습니다. 로그인 상태를 확인해주세요.");
    }
  }, [recipeObjectId, detail, mutate]);

  // 레시피 메타데이터 - useMemo로 메모이제이션
  const recipeMeta = useMemo(() => detail?.selectedRecipe, [detail?.selectedRecipe]);
  const ingredients = useMemo(() => detail?.recipeIngres || [], [detail?.recipeIngres]);
  const steps = useMemo(() => detail?.recipeSteps || [], [detail?.recipeSteps]);

  const canEdit = useMemo(() => isLoggedIn && isAuthor, [isLoggedIn, isAuthor]);

  return (
    <div className="min-h-screen bg-white">
      <Top />

      {loading && !initialData && (
        <div className="max-w-4xl mx-auto px-6 py-8 text-sm text-gray-500">레시피를 불러오는 중입니다...</div>
      )}
      {displayError && !loading && (
        <div className="max-w-4xl mx-auto px-6 py-8 text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl">
          {displayError instanceof Error ? displayError.message : "레시피를 불러오지 못했습니다."}
        </div>
      )}

      <main className="max-w-2xl lg:max-w-6xl mx-auto px-8 py-8 lg:h-[calc(100vh-80px)] lg:overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:h-full">
          {/* 왼쪽: 레시피 메인 정보 */}
          <div className="space-y-6 lg:overflow-y-auto lg:pr-2">
            {/* 레시피 제목 */}
            <div className="flex items-center justify-between rounded-[32px] border border-gray-200 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
              <h1 className="text-4xl font-bold text-black">
                {recipeMeta?.recipeName || "레시피"}
              </h1>
              
              <div className="flex items-center gap-3">
                {/* 편집 버튼 - 로그인하고 작성자인 경우에만 표시 */}
                {canEdit && recipeMeta?.recipeName && (
                  <Link
                    href={`/myPage/recipes/edit?id=${recipeId}&recipeName=${encodeURIComponent(
                      recipeMeta.recipeName
                    )}`}
                    className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
                  >
                    편집
                  </Link>
                )}
                
                {/* 좋아요 버튼 */}
                <button
                  onClick={handleToggleWish}
                  className={`w-8 h-8 flex items-center justify-center transition-colors ${
                    isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    fill={isLiked ? 'currentColor' : 'none'} 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    className="w-6 h-6"
                  >
                    <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* 레시피 이미지 */}
            <div className="w-full aspect-square relative rounded-[32px] border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden shadow-[6px_6px_0_rgba(0,0,0,0.05)] flex items-center justify-center">
              {recipeMeta?.recipeImg ? (
                <Image
                  src={recipeMeta.recipeImg}
                  alt={recipeMeta.recipeName}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority
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

          {/* 오른쪽: 재료, 단계, 댓글 */}
          <div className="space-y-8 lg:overflow-y-auto lg:pr-2">
            {/* 재료 섹션 */}
            <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
              <h2 className="text-2xl font-bold text-black pb-1 mb-4 text-center">
                <span className="border-b-2 border-gray-300 px-1">Ingredient</span>
              </h2>
              
              {ingredients.length === 0 ? (
                <div className="text-center text-sm text-gray-500 py-4">재료 정보가 없습니다.</div>
              ) : (
                ingredients.map((group, idx) => (
                  <div key={`${group.sortType}-${idx}`} className="mb-6 last:mb-0">
                    <button className="px-4 py-2 text-gray-700 rounded-2xl text-base font-medium mb-4 border border-gray-300 bg-white hover:bg-gray-50 transition-colors">
                      {group.sortType || "재료"}
                    </button>
                    <div className="space-y-3 pl-4">
                      {group.ingredientUnit.map((item, i) => (
                        <div
                          key={`${item.ingredientName}-${i}`}
                          className="flex items-center justify-between text-base rounded-xl border border-gray-200 bg-gray-50 px-4 py-2"
                        >
                          <div className="text-gray-900 font-medium">{item.ingredientName}</div>
                          <div className="flex items-center space-x-6">
                            <div className="text-gray-900 font-medium">{item.volume}</div>
                            <div className="text-gray-900 font-medium">{item.unit}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 단계 섹션 */}
            <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
              <h2 className="text-2xl font-bold text-black pb-1 mb-4 text-center">
                <span className="border-b-2 border-gray-300 px-1">Step</span>
              </h2>
              
              {steps.length === 0 ? (
                <div className="text-center text-sm text-gray-500 py-4">조리 단계가 없습니다.</div>
              ) : (
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
                              className="object-cover"
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
              )}
            </div>

            {/* 댓글 섹션 */}
            <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
              <h2 className="text-2xl font-bold text-black pb-1 mb-4 text-center">
                <span className="border-b-2 border-gray-300 px-1">Comment</span>
              </h2>
              
              {/* 댓글 입력 */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="댓글을 입력해주세요"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-300 text-base"
                />
              </div>

              {/* 댓글 목록 */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center border border-gray-400">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                        <span className="text-base font-medium text-gray-900">{comment.username}</span>
                        <span className="text-base text-gray-500">-{comment.time}-</span>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6"/>
                        </svg>
                      </button>
                    </div>
                    <div className="w-full min-h-[40px] border-2 border-dashed border-gray-300 rounded-xl flex items-center px-4 bg-white">
                      <span className="text-gray-700 text-base">-{comment.content}-</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <ScrollToTop />
    </div>
  );
}

export default RecipeDetailClient;

