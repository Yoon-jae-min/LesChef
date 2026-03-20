"use client";

import Top from "@/components/common/navigation/Top";
import ScrollToTop from "@/components/common/ui/ScrollToTop";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import useSWR from "swr";
import { fetchBoardDetail, deleteBoard, type BoardDetailResponse } from "@/utils/api/board";
import { useComments } from "@/hooks/useComments";
import { useLike } from "@/hooks/useLike";
import { checkLoginStatus, getCurrentUserId } from "@/utils/helpers/authUtils";
import { assertApiJsonSuccess } from "@/utils/helpers/apiJsonResponse";

interface BoardDetailProps {
  postId: string;
  initialCategory: string;
  initialData?: BoardDetailResponse | null;
  initialError?: string | null;
}

function BoardDetail({ postId, initialCategory, initialData, initialError }: BoardDetailProps) {
  const [category, setCategory] = useState(initialCategory);
  const [boardType, setBoardType] = useState<string>("notice");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const type = params.get("type") || "notice";
      setBoardType(type);
      if (type === "free") {
        setCategory("자유게시판");
      } else {
        setCategory("공지사항");
      }
    }
  }, []);

  // 게시글 상세 정보 가져오기 - SWR 캐싱 적용
  // 서버에서 가져온 초기 데이터가 있으면 fallbackData로 사용
  const {
    data: detail,
    error: detailError,
    isLoading: loading,
    mutate,
  } = useSWR<BoardDetailResponse>(
    postId ? ["board-detail", postId] : null, // 게시글 ID가 있을 때만 fetch
    () => {
      if (!postId) {
        throw new Error("게시글 ID가 없습니다.");
      }
      return fetchBoardDetail(postId);
    },
    {
      fallbackData: initialData || undefined, // 서버에서 가져온 초기 데이터 사용
    }
  );

  const error = detailError instanceof Error ? detailError.message : initialError || null;
  const displayError = error || (initialError ? new Error(initialError) : null);
  const comments = useMemo(() => detail?.comments || [], [detail?.comments]);
  const isLiked = useMemo(() => !!detail?.liked, [detail?.liked]);
  const likeCount = useMemo(() => detail?.likeCount || 0, [detail?.likeCount]);

  // 댓글 관리 훅
  const { comment, setComment, handleAddComment, handleDeleteComment } = useComments({
    postId,
    detail,
    comments,
    mutate,
  });

  // 좋아요 관리 훅
  const { handleToggleLike } = useLike({
    postId,
    detail,
    isLiked,
    likeCount,
    mutate,
  });

  const authorId = detail?.content?.userId;
  const currentUserId = typeof window !== "undefined" ? getCurrentUserId() : null;
  const canModifyPost = Boolean(
    checkLoginStatus() && authorId && currentUserId && authorId === currentUserId
  );

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const handleDeleteBoard = async () => {
    if (!postId || deleteSubmitting) return;
    setDeleteSubmitting(true);
    try {
      const response = await deleteBoard(postId);
      await assertApiJsonSuccess(response, "ok");
      if (typeof window !== "undefined") {
        window.location.href = `/board/${boardType}`;
      }
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("게시글 삭제 실패:", e);
      }
      alert(e instanceof Error ? e.message : "게시글 삭제에 실패했습니다.");
    } finally {
      setDeleteSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen bg-white lg:overflow-hidden">
      <Top />

      {loading && !initialData && (
        <div className="max-w-4xl mx-auto px-6 py-8 text-sm text-gray-500">
          게시글을 불러오는 중입니다...
        </div>
      )}
      {displayError && !loading && (
        <div className="max-w-4xl mx-auto px-6 py-8 text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl">
          {displayError instanceof Error ? displayError.message : "게시글을 불러오지 못했습니다."}
        </div>
      )}

      <main className="max-w-2xl lg:max-w-6xl mx-auto px-8 py-8 lg:h-[calc(100vh-80px)] lg:overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:h-full">
          {/* 왼쪽: 게시글 메인 정보 */}
          <div className="space-y-6 lg:overflow-y-auto lg:pr-2">
            {/* 제목 영역 */}
            <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500 px-3 py-1 rounded-full bg-gray-100">
                  {category}
                </span>
                <div className="flex items-center gap-3">
                  {canModifyPost && (
                    <>
                      <Link
                        href={`/board/edit?id=${postId}&type=${boardType}`}
                        className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
                      >
                        편집
                      </Link>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="rounded-2xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:border-red-300 hover:bg-red-50 transition"
                      >
                        삭제
                      </button>
                    </>
                  )}

                  {/* 좋아요 버튼 */}
                  <button
                    onClick={handleToggleLike}
                    className={`w-9 h-9 flex items-center justify-center gap-1 rounded-full border transition-colors ${
                      isLiked
                        ? "text-red-500 border-red-200 bg-red-50"
                        : "text-gray-400 border-gray-200 hover:text-red-500 hover:border-red-200"
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill={isLiked ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-5 h-5"
                    >
                      <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" />
                    </svg>
                    <span className="text-xs font-semibold">{likeCount}</span>
                  </button>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-black">
                {detail?.content?.title || "게시글"}
              </h1>
            </div>

            {/* 게시글 내용 */}
            <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
              <div className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
                {detail?.content?.content || "내용이 없습니다."}
              </div>
            </div>
          </div>

          {/* 오른쪽: 댓글 섹션 */}
          <div className="space-y-8 lg:overflow-y-auto lg:pr-2">
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
                  onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                  className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-300 text-base"
                />
              </div>

              {/* 댓글 목록 */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center border border-gray-400">
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5 text-gray-600"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                        <span className="text-base font-medium text-gray-900">
                          {comment.nickName || "익명"}
                        </span>
                        <span className="text-base text-gray-500">
                          {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleDateString("ko-KR")
                            : "-"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="w-5 h-5"
                        >
                          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" />
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

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div
            className="w-full max-w-md rounded-[32px] border border-gray-200 bg-white p-8 shadow-[6px_6px_0_rgba(0,0,0,0.05)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="board-delete-title"
          >
            <h3
              id="board-delete-title"
              className="text-xl font-semibold text-gray-900 text-center mb-2"
            >
              게시글 삭제
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              이 게시글과 댓글·좋아요가 함께 삭제됩니다. 계속할까요?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={deleteSubmitting}
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                disabled={deleteSubmitting}
                onClick={() => void handleDeleteBoard()}
                className="flex-1 rounded-2xl border border-red-200 bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleteSubmitting ? "삭제 중…" : "삭제하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BoardDetail;
