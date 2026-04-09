"use client";

import Link from "next/link";
import useSWR from "swr";
import { fetchBoardList, type BoardListResponse } from "@/utils/api/board";
import { BOARD_CATEGORY_LABEL } from "@/constants/navigation/categories";
import { checkLoginStatus, getCurrentUserId } from "@/utils/helpers/authUtils";

interface BoardListProps {
  initialCategory: "notice" | "free";
  initialPage: number;
  pageSize: number;
  initialData?: BoardListResponse | null;
  initialError?: string | null;
}

function boardListHref(category: "notice" | "free", page: number): string {
  const base = `/board/${category}`;
  if (page <= 1) return base;
  return `${base}?page=${page}`;
}

/** 이전·다음·일부 페이지 번호 (최대 약 7개) */
function buildPageItems(current: number, totalPages: number): number[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const items = new Set<number>();
  items.add(1);
  items.add(totalPages);
  for (let p = current - 2; p <= current + 2; p++) {
    if (p >= 1 && p <= totalPages) items.add(p);
  }
  return Array.from(items).sort((a, b) => a - b);
}

export default function BoardList({
  initialCategory,
  initialPage,
  pageSize,
  initialData,
  initialError,
}: BoardListProps) {
  const listType = initialCategory;
  const page = initialPage;

  const handleEditClick = (e: React.MouseEvent, postId: string, postType: "notice" | "free") => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined") {
      window.location.href = `/board/edit?id=${postId}&type=${postType}`;
    }
  };

  const badgeType = (post: { boardType?: "notice" | "free" }): "notice" | "free" =>
    post.boardType === "free" ? "free" : "notice";

  const currentUserId = typeof window !== "undefined" ? getCurrentUserId() : null;
  const canEditPost = (post: { userId?: string }) =>
    Boolean(
      checkLoginStatus() && currentUserId && post.userId && post.userId === currentUserId
    );

  // 게시글 목록 가져오기 - SWR 캐싱 적용
  // 서버에서 가져온 초기 데이터가 있으면 fallbackData로 사용
  const {
    data,
    error,
    isLoading: loading,
  } = useSWR<BoardListResponse>(
    ["board-list", listType, page, pageSize],
    () => fetchBoardList({ page, limit: pageSize, type: listType }),
    {
      fallbackData: initialData || undefined, // 서버에서 가져온 초기 데이터 사용
    }
  );

  const posts = data?.list || initialData?.list || [];
  const displayError = error || (initialError ? new Error(initialError) : null);
  const total = data?.total ?? initialData?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const showPagination = totalPages > 1 || page > 1;
  const pageItems = showPagination ? buildPageItems(page, totalPages) : [];

  return (
    <div className="space-y-10">
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading && !initialData && (
          <div
            className="col-span-full flex flex-col items-center justify-center gap-4 rounded-[28px] border border-stone-200/90 bg-white/80 px-6 py-14 shadow-sm ring-1 ring-stone-900/[0.03]"
            role="status"
            aria-live="polite"
          >
            <span className="h-9 w-9 animate-spin rounded-full border-2 border-stone-200 border-t-orange-500" />
            <p className="text-center text-sm text-stone-600 sm:text-left">게시글을 불러오는 중입니다…</p>
          </div>
        )}
        {displayError && !loading && (
          <div className="col-span-full rounded-[20px] border border-red-200/90 bg-red-50/90 px-5 py-4 text-sm text-red-800 shadow-sm ring-1 ring-red-900/5">
            {displayError instanceof Error
              ? displayError.message
              : "게시글을 불러오지 못했습니다."}
          </div>
        )}
        {!loading && !displayError && posts.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-[28px] border border-dashed border-stone-300/90 bg-stone-50/60 px-6 py-16 text-center">
            <p className="text-sm font-medium text-stone-800">아직 게시글이 없어요</p>
            <p className="mt-1 max-w-sm text-sm text-stone-500">
              첫 글을 작성해 보시겠어요?
            </p>
          </div>
        )}

        {!loading &&
          !displayError &&
          posts.map((post) => (
            <Link
              key={post._id}
              href={`/board/detail?type=${badgeType(post)}&id=${post._id}`}
              className="group flex flex-col rounded-[28px] border border-stone-200/90 bg-white/95 p-5 shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.03] transition hover:-translate-y-0.5 hover:border-stone-300/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              <div className="relative mb-4 rounded-2xl border border-stone-200/80 bg-gradient-to-br from-stone-50 via-white to-orange-50/30 px-4 py-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                    Post
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      badgeType(post) === "notice"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {BOARD_CATEGORY_LABEL[badgeType(post)] || "게시판"}
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-lg font-semibold tracking-tight text-stone-900 group-hover:text-orange-900">
                  {post.title}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
                <span className="min-w-0 truncate font-medium text-stone-800">
                  {post.nickName || "익명"}
                </span>
                <time
                  className="shrink-0 tabular-nums text-stone-500"
                  dateTime={post.createdAt ? new Date(post.createdAt).toISOString() : undefined}
                >
                  {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
                </time>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-stone-100 pt-4">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  {canEditPost(post) && (
                    <button
                      type="button"
                      onClick={(e) => handleEditClick(e, post._id, badgeType(post))}
                      className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1"
                    >
                      편집
                    </button>
                  )}
                  <span className="text-xs text-stone-500">상세 보기</span>
                </div>
                <span
                  className="text-orange-600 transition group-hover:translate-x-0.5"
                  aria-hidden
                >
                  →
                </span>
              </div>
            </Link>
          ))}
      </section>

      {showPagination && (
        <nav
          className="flex flex-col items-center gap-5 rounded-[28px] border border-stone-200/90 bg-white/80 px-4 py-6 shadow-sm ring-1 ring-stone-900/[0.03] sm:flex-row sm:justify-center sm:gap-8 sm:px-6"
          aria-label="게시글 페이지"
        >
          <div className="flex flex-wrap items-center justify-center gap-2">
            {page <= 1 ? (
              <span className="rounded-2xl border border-stone-100 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-300">
                이전
              </span>
            ) : (
              <Link
                href={boardListHref(listType, page - 1)}
                className="rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                scroll
              >
                이전
              </Link>
            )}
            <span className="px-2 text-sm text-stone-500 tabular-nums">
              {page} / {totalPages}
              {total > 0 ? ` · 총 ${total}건` : ""}
            </span>
            {page >= totalPages ? (
              <span className="rounded-2xl border border-stone-100 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-300">
                다음
              </span>
            ) : (
              <Link
                href={boardListHref(listType, page + 1)}
                className="rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                scroll
              >
                다음
              </Link>
            )}
          </div>
          {pageItems.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {pageItems.map((p, idx) => {
                const prev = pageItems[idx - 1];
                const showGap = idx > 0 && prev !== undefined && p - prev > 1;
                return (
                  <span key={p} className="flex items-center gap-1.5">
                    {showGap && (
                      <span className="px-1 text-sm text-stone-400" aria-hidden>
                        …
                      </span>
                    )}
                    {p === page ? (
                      <span className="min-w-[2.25rem] rounded-xl border border-orange-600 bg-orange-600 px-3 py-1.5 text-center text-sm font-semibold text-white shadow-sm">
                        {p}
                      </span>
                    ) : (
                      <Link
                        href={boardListHref(listType, p)}
                        className="min-w-[2.25rem] rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-center text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1"
                        scroll
                      >
                        {p}
                      </Link>
                    )}
                  </span>
                );
              })}
            </div>
          )}
        </nav>
      )}
    </div>
  );
}
