"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchBoardList, type BoardListResponse } from "@/utils/boardApi";

const CATEGORY_LABEL: Record<string, string> = {
  notice: "공지",
  free: "자유",
};

export default function BoardCategoryPage() {
  const pathname = usePathname();
  const router = useRouter();
  const currentCategory = pathname.split("/").pop() || "notice";
  const [posts, setPosts] = useState<BoardListResponse["list"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleEditClick = (e: React.MouseEvent, postId: number) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/board/edit?id=${postId}&type=${currentCategory}`);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBoardList({ page: 1, limit: 20 });
        setPosts(data.list || []);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "게시글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentCategory]);

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {loading && (
        <div className="col-span-full flex items-center justify-center py-12 text-sm text-gray-500">
          게시글을 불러오는 중입니다...
        </div>
      )}
      {error && !loading && (
        <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {!loading && !error && posts.length === 0 && (
        <div className="col-span-full flex items-center justify-center py-12 text-sm text-gray-500">
          게시글이 없습니다.
        </div>
      )}

      {!loading && !error && posts.map((post) => (
        <Link
          key={post._id}
          href={`/board/detail?type=${currentCategory}&id=${post._id}`}
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
                {CATEGORY_LABEL[currentCategory] || "게시판"}
              </span>
            </div>
            <p className="mt-3 text-xl font-semibold text-gray-900">{post.title}</p>
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{post.content}</p>
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
                onClick={(e) => handleEditClick(e, post._id as unknown as number)}
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
