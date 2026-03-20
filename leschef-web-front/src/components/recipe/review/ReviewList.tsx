"use client";

import type { RecipeReview } from "./ReviewForm";

interface ReviewListProps {
  reviews: RecipeReview[];
  loading: boolean;
  error: string | null;
}

export default function ReviewList({ reviews, loading, error }: ReviewListProps) {
  if (loading) {
    return (
      <div className="text-center text-sm text-gray-500 py-4">리뷰를 불러오는 중입니다...</div>
    );
  }

  if (error) {
    return <div className="text-center text-sm text-red-500 py-4">{error}</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500 py-4">아직 작성된 리뷰가 없습니다.</div>
    );
  }

  return (
    <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
      {reviews.map((review) => (
        <div
          key={review._id || `${review.userId}-${review.createdAt}`}
          className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-4"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center border border-gray-400">
                <span className="text-sm text-gray-700">{review.userNickName?.[0] || "유"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {review.userNickName || "사용자"}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleString("ko-KR")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-sm">★</span>
              <span className="text-sm font-semibold text-gray-900">{review.rating}</span>
            </div>
          </div>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">
            {review.comment || "내용 없음"}
          </p>
        </div>
      ))}
    </div>
  );
}
