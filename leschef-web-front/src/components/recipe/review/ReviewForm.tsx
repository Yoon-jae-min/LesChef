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
    <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-800">
          나의 평점
        </span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => isLoggedIn && setMyRating(star)}
              className="text-xl focus:outline-none"
            >
              <span
                className={
                  star <= myRating ? "text-yellow-400" : "text-gray-300"
                }
              >
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
        className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white disabled:bg-gray-100"
      />
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {myComment.length} / 1000자
        </span>
        <div className="flex items-center gap-2">
          {myReview && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="px-3 py-1.5 text-xs rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-60"
            >
              내 리뷰 삭제
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isLoggedIn || isSubmitting || myRating === 0}
            className="px-4 py-1.5 text-xs rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {myReview ? "리뷰 수정" : "리뷰 등록"}
          </button>
        </div>
      </div>
    </div>
  );
}

