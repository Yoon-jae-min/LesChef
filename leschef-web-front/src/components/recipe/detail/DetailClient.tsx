"use client";

import Top from "@/components/common/navigation/Top";
import ScrollToTop from "@/components/common/ui/ScrollToTop";
import { useState, useEffect, useCallback, useMemo } from "react";
import useSWR from "swr";
import { fetchRecipeDetail, toggleRecipeWish, type RecipeDetailResponse } from "@/utils/api/recipeApi";
import { checkLoginStatus, getCurrentUserId } from "@/utils/helpers/authUtils";
import { TIMING } from "@/constants/system/timing";
import Review from "../review/Review";
import DetailMeta from "./DetailMeta";
import Ingredients from "./Ingredients";
import DetailSteps from "./DetailSteps";

interface DetailClientProps {
  recipeId: string;
  recipeNameParam: string;
  initialData?: RecipeDetailResponse | null;
  initialError?: string | null;
}

function DetailClient({ 
  recipeId, 
  recipeNameParam, 
  initialData, 
  initialError 
}: DetailClientProps) {
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
          <DetailMeta
            recipeMeta={recipeMeta}
            recipeId={recipeId}
            canEdit={canEdit}
            isLiked={isLiked}
            onToggleWish={handleToggleWish}
          />

          {/* 오른쪽: 재료, 단계, 리뷰 */}
          <div className="space-y-8 lg:overflow-y-auto lg:pr-2">
            <Ingredients ingredients={ingredients} />
            <DetailSteps steps={steps} />

            {/* 리뷰 섹션 */}
            {recipeObjectId && (
              <Review recipeId={recipeObjectId} />
            )}
          </div>
        </div>
      </main>
      <ScrollToTop />
    </div>
  );
}

export default DetailClient;

