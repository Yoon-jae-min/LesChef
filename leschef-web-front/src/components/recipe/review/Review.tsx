"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { checkLoginStatus, getCurrentUserId } from "@/utils/helpers/authUtils";
import { TIMING } from "@/constants/system/timing";
import { API_CONFIG } from "@/config/apiConfig";
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

      const response = await fetch(url.toString(), {
        method: "GET",
        credentials: "include",
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

  const handleSubmit = useCallback(async (rating: number, comment: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${REVIEW_API_BASE}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
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
  }, [recipeId, currentUserId]);

  const handleDelete = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${REVIEW_API_BASE}/review`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
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
    <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
      <h2 className="text-2xl font-bold text-black pb-1 mb-4 text-center">
        <span className="border-b-2 border-gray-300 px-1">Review</span>
      </h2>

      {/* 요약 정보 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 text-xl">★</span>
          <span className="text-lg font-semibold text-gray-900">
            {roundedAverage || "평가 없음"}
          </span>
          {count > 0 && (
            <span className="text-sm text-gray-500">({count}명)</span>
          )}
        </div>
        {isLoggedIn ? (
          <span className="text-xs text-gray-500">
            로그인 상태입니다. 리뷰를 작성해보세요.
          </span>
        ) : (
          <span className="text-xs text-gray-500">
            로그인 후 리뷰를 작성할 수 있습니다.
          </span>
        )}
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
    </div>
  );
}

