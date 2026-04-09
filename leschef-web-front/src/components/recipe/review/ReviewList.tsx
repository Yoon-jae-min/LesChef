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
      <p className="py-6 text-center text-sm text-stone-500" role="status" aria-live="polite">
        리뷰를 불러오는 중입니다...
      </p>
    );
  }

  if (error) {
    return (
      <p className="py-6 text-center text-sm text-red-600" role="alert">
        {error}
      </p>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-stone-500">아직 작성된 리뷰가 없습니다.</p>
    );
  }

  return (
    <ul className="max-h-72 space-y-3 overflow-y-auto pr-1">
      {reviews.map((review) => (
        <li
          key={review._id || `${review.userId}-${review.createdAt}`}
          className="rounded-2xl border border-stone-200/80 bg-gradient-to-br from-white to-stone-50/80 p-4 shadow-sm"
        >
          <div className="mb-2 flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-orange-100 bg-orange-50 text-sm font-semibold text-orange-800">
                <span aria-hidden>{review.userNickName?.[0] || "유"}</span>
              </div>
              <div className="min-w-0 flex flex-col">
                <span className="truncate text-sm font-medium text-stone-900">
                  {review.userNickName || "사용자"}
                </span>
                <time
                  className="text-xs text-stone-500"
                  dateTime={review.createdAt}
                >
                  {new Date(review.createdAt).toLocaleString("ko-KR")}
                </time>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1 tabular-nums">
              <span className="text-sm text-amber-400" aria-hidden>
                ★
              </span>
              <span className="text-sm font-semibold text-stone-900">{review.rating}</span>
            </div>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-700">
            {review.comment || "내용 없음"}
          </p>
        </li>
      ))}
    </ul>
  );
}
