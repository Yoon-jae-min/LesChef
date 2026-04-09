"use client";

import { useState, useEffect } from "react";

export type RecipeReview = {
  _id?: string;
  recipeId: string;
  userId: string;
  userNickName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

interface ReviewFormProps {
  recipeId: string;
  isLoggedIn: boolean;
  currentUserId: string | null;
  myReview: RecipeReview | null;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  onDelete: () => Promise<void>;
  isSubmitting: boolean;
}

export default function ReviewForm({
  recipeId,
  isLoggedIn,
  currentUserId,
  myReview,
  onSubmit,
  onDelete,
  isSubmitting,
}: ReviewFormProps) {
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");

  // 내 리뷰가 있으면 초기값 설정
  useEffect(() => {
    if (myReview) {
      setMyRating(myReview.rating);
      setMyComment(myReview.comment || "");
    } else {
      setMyRating(0);
      setMyComment("");
    }
  }, [myReview]);

  const handleSubmit = async () => {
    if (!isLoggedIn || !currentUserId) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
    if (!recipeId) {
      alert("레시피 정보가 없습니다.");
      return;
    }
    if (myRating < 1 || myRating > 5) {
      alert("평점은 1~5 사이여야 합니다.");
      return;
    }

    await onSubmit(myRating, myComment.trim());
  };

  const handleDelete = async () => {
    if (!isLoggedIn || !currentUserId) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
    if (!recipeId) {
      alert("레시피 정보가 없습니다.");
      return;
    }

    const confirmed = window.confirm("내 리뷰를 삭제할까요?");
    if (!confirmed) return;

    await onDelete();
  };

  return (
    <div className="mb-6 rounded-2xl border border-stone-200/90 bg-stone-50/60 p-4 sm:p-5">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm font-semibold text-stone-800">나의 평점</span>
        <div className="flex items-center gap-0.5" role="group" aria-label="별점 선택 1에서 5까지">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => isLoggedIn && setMyRating(star)}
              disabled={!isLoggedIn || isSubmitting}
              aria-label={`${star}점`}
              className="rounded-lg p-1 text-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:opacity-50"
            >
              <span className={star <= myRating ? "text-amber-400" : "text-stone-300"} aria-hidden>
                ★
              </span>
            </button>
          ))}
        </div>
      </div>
      <textarea
        value={myComment}
        onChange={(e) => setMyComment(e.target.value)}
        placeholder={
          isLoggedIn
            ? "레시피를 사용해본 소감, 맛, 팁 등을 남겨주세요. (최대 1000자)"
            : "로그인 후 리뷰를 작성할 수 있습니다."
        }
        disabled={!isLoggedIn || isSubmitting}
        maxLength={1000}
        className="min-h-[88px] w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-stone-100"
      />
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs text-stone-400">{myComment.length} / 1000자</span>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {myReview && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 transition hover:bg-stone-50 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2"
            >
              내 리뷰 삭제
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isLoggedIn || isSubmitting || myRating === 0}
            className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            {myReview ? "리뷰 수정" : "리뷰 등록"}
          </button>
        </div>
      </div>
    </div>
  );
}
