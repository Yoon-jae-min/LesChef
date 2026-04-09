"use client";

import Top from "@/components/common/navigation/Top";
import ScrollToTop from "@/components/common/ui/ScrollToTop";
import { useState, useEffect, useCallback, useMemo } from "react";
import useSWR from "swr";
import {
  fetchRecipeDetailById,
  toggleRecipeWish,
  type RecipeDetailResponse,
} from "@/utils/api/recipeApi";
import { checkLoginStatus, getCurrentUserId } from "@/utils/helpers/authUtils";
import { TIMING } from "@/constants/system/timing";
import Review from "../review/Review";
import DetailMeta from "./DetailMeta";
import Ingredients from "./Ingredients";
import DetailSteps from "./DetailSteps";

interface DetailClientProps {
  recipeId: string;
  initialData?: RecipeDetailResponse | null;
  initialError?: string | null;
}

function DetailClient({ recipeId, initialData, initialError }: DetailClientProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);

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

  const swrKey = recipeId ? (["recipe-detail", "id", recipeId] as const) : null;

  const {
    data: detail,
    error: detailError,
    isLoading: loading,
    mutate,
  } = useSWR<RecipeDetailResponse>(
    swrKey,
    () => {
      if (recipeId) return fetchRecipeDetailById(recipeId);
      throw new Error("레시피 id가 필요합니다.");
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: TIMING.TEN_MINUTES,
      fallbackData: initialData || undefined,
    }
  );

  const error = detailError instanceof Error ? detailError.message : initialError || null;
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

    if (!isLoggedIn) {
      alert("찜하기는 로그인 후 이용할 수 있습니다.");
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
      mutate({ ...detail, recipeWish: result.recipeWish }, false);
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
  }, [recipeObjectId, detail, mutate, isLoggedIn]);

  // 레시피 메타데이터 - useMemo로 메모이제이션
  const recipeMeta = useMemo(() => detail?.selectedRecipe, [detail?.selectedRecipe]);
  const ingredients = useMemo(() => detail?.recipeIngres || [], [detail?.recipeIngres]);
  const steps = useMemo(() => detail?.recipeSteps || [], [detail?.recipeSteps]);

  const canEdit = useMemo(() => isLoggedIn && isAuthor, [isLoggedIn, isAuthor]);

  return (
    <div className="min-h-screen bg-white">
      <Top />

      {loading && !initialData && (
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-3 px-6 py-12 text-sm text-stone-600">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-orange-500"
            aria-hidden
          />
          <p role="status" aria-live="polite">
            레시피를 불러오는 중입니다...
          </p>
        </div>
      )}
      {displayError && !loading && (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <div
            className="rounded-2xl border border-red-200/80 bg-red-50 px-5 py-4 text-sm text-red-800 shadow-sm"
            role="alert"
          >
            {displayError instanceof Error ? displayError.message : "레시피를 불러오지 못했습니다."}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:max-w-6xl lg:h-[calc(100vh-80px)] lg:overflow-hidden lg:px-8 lg:py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16 lg:h-full">
          {/* 왼쪽: 레시피 메인 정보 */}
          <DetailMeta
            recipeMeta={recipeMeta}
            recipeId={recipeObjectId || recipeId}
            canEdit={canEdit}
            isLiked={isLiked}
            onToggleWish={handleToggleWish}
          />

          {/* 오른쪽: 재료, 단계, 리뷰 */}
          <div className="space-y-8 lg:overflow-y-auto lg:pr-2">
            <Ingredients ingredients={ingredients} />
            <DetailSteps steps={steps} />

            {/* 리뷰 섹션 */}
            {recipeObjectId && <Review recipeId={recipeObjectId} />}
          </div>
        </div>
      </main>
      <ScrollToTop />
    </div>
  );
}

export default DetailClient;
