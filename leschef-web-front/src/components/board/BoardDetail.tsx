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
import ErrorMessage from "@/components/common/ui/ErrorMessage";

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
      setBoardType(type === "free" ? "free" : "notice");
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

  // 서버에 저장된 게시판 구분(공지/자유)으로 동기화 — URL type이 어긋나도 표시·삭제 후 이동이 맞게 동작
  useEffect(() => {
    const bt = detail?.content?.boardType;
    if (bt === "free" || bt === "notice") {
      setBoardType(bt);
      setCategory(bt === "free" ? "자유게시판" : "공지사항");
    }
  }, [detail?.content?.boardType]);

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
    <div className="min-h-screen bg-white lg:h-screen lg:overflow-hidden">
      <Top />

      {loading && !initialData && (
        <div
          className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-16"
          role="status"
          aria-live="polite"
        >
          <span className="h-9 w-9 animate-spin rounded-full border-2 border-stone-200 border-t-orange-500" />
          <p className="text-sm text-stone-600">게시글을 불러오는 중입니다…</p>
        </div>
      )}
      {displayError && !loading && (
        <div className="mx-auto max-w-4xl px-6 py-8">
          <ErrorMessage
            error={displayError}
            showDetails={false}
            showAction={true}
            onRetry={() => void mutate()}
          />
        </div>
      )}

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:max-w-6xl lg:h-[calc(100vh-80px)] lg:overflow-hidden lg:px-8 lg:pb-10 lg:pt-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:h-full lg:gap-12">
          <div className="space-y-6 lg:overflow-y-auto lg:pr-2">
            <article className="rounded-[28px] border border-stone-200/90 bg-white/95 p-6 shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.03] sm:p-7">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                    boardType === "notice"
                      ? "bg-orange-100 text-orange-900"
                      : "bg-stone-100 text-stone-800"
                  }`}
                >
                  {category}
                </span>
                <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                  {canModifyPost && (
                    <>
                      <Link
                        href={`/board/edit?id=${postId}&type=${boardType}`}
                        className="rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                      >
                        편집
                      </Link>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="rounded-2xl border border-red-200/90 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      >
                        삭제
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={handleToggleLike}
                    className={`inline-flex h-10 min-w-[3.5rem] items-center justify-center gap-1 rounded-full border px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
                      isLiked
                        ? "border-red-200 bg-red-50 text-red-600"
                        : "border-stone-200 bg-white text-stone-500 hover:border-red-200 hover:bg-red-50/50 hover:text-red-500"
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill={isLiked ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5 shrink-0"
                      aria-hidden
                    >
                      <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" />
                    </svg>
                    <span className="tabular-nums">{likeCount}</span>
                  </button>
                </div>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                {detail?.content?.title || "게시글"}
              </h1>
            </article>

            <div className="rounded-[28px] border border-stone-200/90 bg-white/95 p-6 shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.03] sm:p-7">
              <div className="text-base leading-relaxed text-stone-800 whitespace-pre-wrap">
                {detail?.content?.content || "내용이 없습니다."}
              </div>
            </div>
          </div>

          <div className="space-y-8 pb-8 lg:overflow-y-auto lg:pr-2">
            <section className="rounded-[28px] border border-stone-200/90 bg-white/95 p-6 shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.03] sm:p-7">
              <h2 className="mb-6 text-lg font-bold tracking-tight text-stone-900">
                댓글{" "}
                <span className="font-normal text-stone-500">({comments.length})</span>
              </h2>

              <div className="mb-6">
                <label htmlFor="board-comment-input" className="sr-only">
                  댓글 입력
                </label>
                <input
                  id="board-comment-input"
                  type="text"
                  placeholder="댓글을 입력해 주세요"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 px-4 py-3.5 text-base text-stone-900 placeholder:text-stone-400 transition focus:border-orange-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/25"
                />
              </div>

              <div className="space-y-3">
                {comments.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/40 py-10 text-center text-sm text-stone-500">
                    아직 댓글이 없어요. 첫 댓글을 남겨 보세요.
                  </p>
                )}
                {comments.map((c) => (
                  <div
                    key={c._id}
                    className="rounded-2xl border border-stone-200/80 bg-gradient-to-br from-stone-50/80 to-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="mb-3 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500">
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5"
                            aria-hidden
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                        <span className="font-medium text-stone-900">{c.nickName || "익명"}</span>
                        <span className="text-sm text-stone-500">
                          {c.createdAt
                            ? new Date(c.createdAt).toLocaleDateString("ko-KR")
                            : "-"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(c._id)}
                        className="shrink-0 rounded-lg p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                        aria-label="댓글 삭제"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-5 w-5"
                        >
                          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </div>
                    <p className="rounded-xl border border-stone-100 bg-white/90 px-4 py-3 text-base text-stone-800">
                      {c.content}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <ScrollToTop />

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/45 p-4 backdrop-blur-[2px]">
          <div
            className="w-full max-w-md rounded-[28px] border border-stone-200/90 bg-white p-8 shadow-xl shadow-stone-900/10 ring-1 ring-stone-900/[0.04]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="board-delete-title"
          >
            <h3
              id="board-delete-title"
              className="mb-2 text-center text-xl font-semibold text-stone-900"
            >
              게시글 삭제
            </h3>
            <p className="mb-6 text-center text-sm text-stone-600">
              이 게시글과 댓글·좋아요가 함께 삭제됩니다. 계속할까요?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={deleteSubmitting}
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                disabled={deleteSubmitting}
                onClick={() => void handleDeleteBoard()}
                className="flex-1 rounded-2xl border border-red-600 bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50"
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
