"use client";

// 동적 렌더링 강제 (useSearchParams 이슈 방지)
export const dynamic = "force-dynamic";

import Top from "@/components/common/navigation/Top";
import { useState, useEffect } from "react";
import { createBoard } from "@/utils/api/board";
import { assertApiJsonSuccess } from "@/utils/helpers/apiJsonResponse";
import { reportActionFailure } from "@/utils/helpers/actionFailure";

export default function BoardWritePage() {
  const [boardType, setBoardType] = useState<string>("notice");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // URL 파라미터에서 boardType 가져오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const type = params.get("type") || "notice";
      setBoardType(type);
    }
  }, []);

  const categoryName = boardType === "free" ? "자유게시판" : "공지사항";

  const handleSubmitBoard = async () => {
    try {
      const response = await createBoard({
        title,
        content,
        boardType: boardType === "free" ? "free" : "notice",
      });

      await assertApiJsonSuccess(response, "ok");
      if (typeof window !== "undefined") {
        window.location.href = `/board/${boardType}`;
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("게시글 작성 실패:", error);
      }
      reportActionFailure(error, { redirect: "back" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmitBoard();
  };

  return (
    <div className="min-h-screen bg-white">
      <Top />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <header className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-600/90">
            Board Write
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            게시글 작성
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
            커뮤니티에 글을 남겨 보세요.
          </p>
        </header>

        <div className="mb-8 rounded-[28px] border border-stone-200/90 bg-white/95 px-5 py-4 shadow-sm ring-1 ring-stone-900/[0.03] sm:px-6">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              boardType === "free"
                ? "bg-stone-100 text-stone-800"
                : "bg-orange-100 text-orange-900"
            }`}
          >
            {categoryName}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-[28px] border border-stone-200/90 bg-white/95 p-6 shadow-sm ring-1 ring-stone-900/[0.03] sm:p-8">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="board-write-title"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  제목
                </label>
                <input
                  id="board-write-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50/30 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-orange-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/25"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="board-write-body"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  내용
                </label>
                <textarea
                  id="board-write-body"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="내용을 입력하세요..."
                  rows={15}
                  className="w-full resize-none rounded-2xl border border-stone-200 bg-stone-50/30 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-orange-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/25"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.history.back();
                }
              }}
              className="rounded-2xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              게시글 등록
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
