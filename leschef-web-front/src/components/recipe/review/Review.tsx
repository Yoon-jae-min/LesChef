"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { checkLoginStatus, getCurrentUserId } from "@/utils/helpers/authUtils";
import { TIMING } from "@/constants/system/timing";
import { API_CONFIG } from "@/config/apiConfig";
import { authFetch } from "@/utils/api/authFetch";
import ReviewForm, { type RecipeReview } from "./ReviewForm";
import ReviewList from "./ReviewList";

type ReviewListResponse = {
  error: boolean;
  reviews: RecipeReview[];
  averageRating: number;
  count: number;
};

type UpsertReviewResponse = {
  error: boolean;
  review: RecipeReview;
  averageRating: number;
  count: number;
};

type DeleteReviewResponse = {
  error: boolean;
  message: string;
  averageRating: number;
  count: number;
};

interface ReviewProps {
  recipeId: string;
}

const REVIEW_API_BASE = `${API_CONFIG.RECIPE_API}`;

export default function Review({ recipeId }: ReviewProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<RecipeReview[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [count, setCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 로그인 상태 및 사용자 ID 확인
  useEffect(() => {
    const loggedIn = checkLoginStatus();
    setIsLoggedIn(loggedIn);
    setCurrentUserId(getCurrentUserId());
  }, []);

  const fetchReviews = useCallback(async () => {
    if (!recipeId) return;
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${REVIEW_API_BASE}/reviews`);
      url.searchParams.set("recipeId", recipeId);

      const response = await authFetch(url.toString(), {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("리뷰를 불러오지 못했습니다.");
      }

      const data = (await response.json()) as ReviewListResponse;
      if (data.error) {
        throw new Error("리뷰를 불러오지 못했습니다.");
      }

      setReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
      setCount(data.count || 0);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("리뷰를 불러오지 못했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }, [recipeId]);

  useEffect(() => {
    fetchReviews();
    const timer = setInterval(fetchReviews, TIMING.TEN_MINUTES);
    return () => clearInterval(timer);
  }, [fetchReviews]);

  const handleSubmit = useCallback(
    async (rating: number, comment: string) => {
      setIsSubmitting(true);
      try {
        const response = await authFetch(`${REVIEW_API_BASE}/review`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipeId,
            rating,
            comment,
          }),
        });

        if (!response.ok) {
          throw new Error("리뷰 등록에 실패했습니다.");
        }

        const data = (await response.json()) as UpsertReviewResponse;
        if (data.error) {
          throw new Error("리뷰 등록에 실패했습니다.");
        }

        // 로컬 상태 업데이트
        setAverageRating(data.averageRating || 0);
        setCount(data.count || 0);
        setReviews((prev) => {
          const others = prev.filter((r) => r.userId !== currentUserId);
          return [...others, data.review];
        });

        alert("리뷰가 저장되었습니다.");
      } catch (err) {
        if (err instanceof Error) {
          alert(err.message);
        } else {
          alert("리뷰 등록에 실패했습니다.");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [recipeId, currentUserId]
  );

  const handleDelete = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const response = await authFetch(`${REVIEW_API_BASE}/review`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId }),
      });

      if (!response.ok) {
        throw new Error("리뷰 삭제에 실패했습니다.");
      }

      const data = (await response.json()) as DeleteReviewResponse;
      if (data.error) {
        throw new Error("리뷰 삭제에 실패했습니다.");
      }

      setAverageRating(data.averageRating || 0);
      setCount(data.count || 0);
      setReviews((prev) => prev.filter((r) => r.userId !== currentUserId));

      alert("리뷰가 삭제되었습니다.");
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("리뷰 삭제에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [recipeId, currentUserId]);

  const myReview = useMemo(
    () => reviews.find((r) => r.userId === currentUserId) || null,
    [reviews, currentUserId]
  );

  const roundedAverage = useMemo(
    () => (averageRating ? Math.round(averageRating * 10) / 10 : 0),
    [averageRating]
  );

  return (
    <section
      className="rounded-[28px] border border-stone-200/90 bg-white/95 p-5 shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.03] sm:p-6"
      aria-labelledby="recipe-review-heading"
    >
      <h2
        id="recipe-review-heading"
        className="mb-4 text-center text-xl font-bold tracking-tight text-stone-900 sm:mb-5 sm:text-2xl"
      >
        <span className="inline-block border-b-2 border-orange-400/80 pb-1">리뷰</span>
      </h2>

      {/* 요약 정보 */}
      <div className="mb-5 flex flex-col gap-2 rounded-2xl border border-stone-100 bg-stone-50/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl text-amber-400" aria-hidden>
            ★
          </span>
          <span className="text-lg font-semibold tabular-nums text-stone-900">
            {roundedAverage || "평가 없음"}
          </span>
          {count > 0 && (
            <span className="text-sm text-stone-500">({count}명 참여)</span>
          )}
        </div>
        <p className="text-xs text-stone-500 sm:text-right">
          {isLoggedIn ? "리뷰를 남겨 다른 분께 도움을 주세요." : "로그인 후 리뷰를 작성할 수 있습니다."}
        </p>
      </div>

      {/* 리뷰 작성 폼 */}
      <ReviewForm
        recipeId={recipeId}
        isLoggedIn={isLoggedIn}
        currentUserId={currentUserId}
        myReview={myReview}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isSubmitting={isSubmitting}
      />

      {/* 리뷰 목록 */}
      <ReviewList reviews={reviews} loading={loading} error={error} />
    </section>
  );
}
