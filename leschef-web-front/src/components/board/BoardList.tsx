"use client";

import Link from "next/link";
import useSWR from "swr";
import { fetchBoardList, type BoardListResponse } from "@/utils/api/board";
import { BOARD_CATEGORY_LABEL } from "@/constants/navigation/categories";

interface BoardListProps {
  initialCategory: string;
  initialData?: BoardListResponse | null;
  initialError?: string | null;
}

export default function BoardList({ initialCategory, initialData, initialError }: BoardListProps) {
  const handleEditClick = (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined") {
      window.location.href = `/board/edit?id=${postId}&type=${initialCategory}`;
    }
  };

  // 게시글 목록 가져오기 - SWR 캐싱 적용
  // 서버에서 가져온 초기 데이터가 있으면 fallbackData로 사용
  const {
    data,
    error,
    isLoading: loading,
  } = useSWR<BoardListResponse>(
    ["board-list", initialCategory], // 캐시 키: 카테고리별로 별도 캐시
    () => fetchBoardList({ page: 1, limit: 20 }),
    {
      fallbackData: initialData || undefined, // 서버에서 가져온 초기 데이터 사용
    }
  );

  const posts = data?.list || initialData?.list || [];
  const displayError = error || (initialError ? new Error(initialError) : null);

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {loading && !initialData && (
        <div className="col-span-full flex items-center justify-center py-12 text-sm text-gray-500">
          게시글을 불러오는 중입니다...
        </div>
      )}
      {displayError && !loading && (
        <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {displayError instanceof Error ? displayError.message : "게시글을 불러오지 못했습니다."}
        </div>
      )}
      {!loading && !displayError && posts.length === 0 && (
        <div className="col-span-full flex items-center justify-center py-12 text-sm text-gray-500">
          게시글이 없습니다.
        </div>
      )}

      {!loading &&
        !displayError &&
        posts.map((post) => (
          <Link
            key={post._id}
            href={`/board/detail?type=${initialCategory}&id=${post._id}`}
            className="group flex flex-col rounded-[32px] border border-gray-200 bg-white p-5 shadow-[6px_6px_0_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <div
              className={`relative mb-4 rounded-[24px] border border-gray-200 bg-gradient-to-r from-gray-50 to-white px-5 py-4`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-600">
                  Board
                </span>
                <span className="rounded-full border border-gray-200 px-3 py-1 text-[11px] font-semibold text-gray-900">
                  {BOARD_CATEGORY_LABEL[initialCategory] || "게시판"}
                </span>
              </div>
              <p className="mt-3 text-xl font-semibold text-gray-900">{post.title}</p>
              <div className="absolute inset-0 rounded-[24px] border border-gray-200/10" />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-medium text-gray-900">{post.nickName || "익명"}</span>
              <span className="truncate max-w-[120px]">
                {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleEditClick(e, post._id)}
                  className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
                >
                  편집
                </button>
                <span className="text-xs text-gray-500">게시글 상세 보기</span>
              </div>
              <span className="font-semibold text-gray-800 text-xs">→</span>
            </div>
          </Link>
        ))}
    </section>
  );
}
