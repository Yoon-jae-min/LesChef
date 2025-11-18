"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SAMPLE_POSTS = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  title: "커뮤니티 글 제목 예시",
  excerpt: "레시피 공유, 보관함 관리 꿀팁 등 자유롭게 이야기를 나누어 보세요.",
  date: "2025-01-25",
  time: "14:20",
  author: "user_leschef",
  highlight: index % 2 === 0 ? "from-orange-100 to-rose-100" : "from-yellow-100 to-amber-100",
  tag: index % 2 === 0 ? "공지" : "자유",
}));

export default function BoardCategoryPage() {
  const pathname = usePathname();
  const currentCategory = pathname.split("/").pop() || "notice";

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {SAMPLE_POSTS.map((post) => (
        <Link
          key={post.id}
          href={`/board/detail?type=${currentCategory}`}
          className="group flex flex-col rounded-[32px] border border-gray-200 bg-white p-5 shadow-[6px_6px_0_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <div
            className={`relative mb-4 rounded-[24px] border border-gray-200 bg-gradient-to-r ${post.highlight} px-5 py-4`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-600">
                Board
              </span>
              <span className="rounded-full border border-gray-200 px-3 py-1 text-[11px] font-semibold text-gray-900">
                {post.tag}
              </span>
            </div>
            <p className="mt-3 text-xl font-semibold text-gray-900">{post.title}</p>
            <p className="mt-1 text-sm text-gray-600">{post.excerpt}</p>
            <div className="absolute inset-0 rounded-[24px] border border-gray-200/10" />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-medium text-gray-900">{post.author}</span>
            <span>
              {post.date} · {post.time}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>게시글 상세 보기</span>
            <span className="font-semibold text-gray-800">→</span>
          </div>
        </Link>
      ))}
    </section>
  );
}
