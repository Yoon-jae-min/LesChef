"use client";

import Link from "next/link";
import useSWR from "swr";
import { fetchBoardList, type BoardListResponse } from "@/utils/api/board";
import { checkLoginStatus, getCurrentUserId } from "@/utils/helpers/authUtils";
import ErrorMessage from "@/components/common/ui/ErrorMessage";

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
    mutate,
  } = useSWR<BoardListResponse>(
    ["board-list", listType, page, pageSize],
    () => fetchBoardList({ page, limit: pageSize, type: listType }),
    {
      fallbackData: initialData || undefined, // 서버에서 가져온 초기 데이터 사용
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 1500,
      revalidateOnReconnect: true,
    }
  );

  const posts = data?.list || initialData?.list || [];
  const displayError = error || (initialError ? new Error(initialError) : null);
  const total = data?.total ?? initialData?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const showPagination = totalPages > 1 || page > 1;
  const pageItems = showPagination ? buildPageItems(page, totalPages) : [];

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        {loading && !initialData && (
          <div
            className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-stone-200/90 bg-white px-6 py-14 shadow-sm"
            role="status"
            aria-live="polite"
          >
            <span className="h-9 w-9 animate-spin rounded-full border-2 border-stone-200 border-t-green-500" />
            <p className="text-center text-sm text-stone-600">게시글을 불러오는 중입니다…</p>
          </div>
        )}
        {displayError && !loading && (
          <ErrorMessage
            error={displayError}
            showDetails={false}
            showAction={true}
            onRetry={() => void mutate()}
          />
        )}
        {!loading && !displayError && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300/90 bg-stone-50/60 px-6 py-16 text-center">
            <p className="text-sm font-medium text-stone-800">아직 게시글이 없어요</p>
            <p className="mt-1 max-w-sm text-sm text-stone-500">첫 글을 작성해 보시겠어요?</p>
          </div>
        )}

        {!loading &&
          !displayError &&
          posts.map((post) => {
            const type = badgeType(post);
            return (
              <article
                key={post._id}
                className="flex flex-col gap-4 rounded-2xl border border-stone-200/90 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5 sm:py-4"
              >
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="w-16 shrink-0 sm:w-20">
                    <span
                      className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${
                        type === "notice"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {type === "notice" ? "공지" : "자유"}
                    </span>
                    <p className="mt-1.5 truncate text-xs text-stone-500">
                      {post.nickName || "익명"}
                    </p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/board/detail?type=${type}&id=${post._id}`}
                      className="block text-base font-semibold text-stone-900 transition-colors hover:text-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 rounded"
                    >
                      {post.title}
                    </Link>
                    <time
                      className="mt-1 block text-xs tabular-nums text-stone-500"
                      dateTime={post.createdAt ? new Date(post.createdAt).toISOString() : undefined}
                    >
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString("ko-KR")
                        : ""}
                    </time>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                  {canEditPost(post) && (
                    <button
                      type="button"
                      onClick={(e) => handleEditClick(e, post._id, type)}
                      className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1"
                    >
                      편집
                    </button>
                  )}
                  <Link
                    href={`/board/detail?type=${type}&id=${post._id}`}
                    className="rounded-xl border border-green-600 px-3.5 py-1.5 text-xs font-semibold text-green-700 transition hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1"
                  >
                    상세 보기
                  </Link>
                </div>
              </article>
            );
          })}
      </section>

      {showPagination && (
        <nav
          className="flex flex-col items-center gap-5 rounded-2xl border border-stone-200/90 bg-white px-4 py-6 shadow-sm sm:flex-row sm:justify-center sm:gap-8 sm:px-6"
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
                className="rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-800 shadow-sm transition hover:border-green-200 hover:bg-green-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                scroll
              >
                이전
              </Link>
            )}
            <span className="px-2 text-sm tabular-nums text-stone-500">
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
                className="rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-800 shadow-sm transition hover:border-green-200 hover:bg-green-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
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
                      <span className="min-w-[2.25rem] rounded-xl border border-green-600 bg-green-600 px-3 py-1.5 text-center text-sm font-semibold text-white shadow-sm">
                        {p}
                      </span>
                    ) : (
                      <Link
                        href={boardListHref(listType, p)}
                        className="min-w-[2.25rem] rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-center text-sm font-medium text-stone-700 shadow-sm transition hover:border-green-200 hover:bg-green-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1"
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
