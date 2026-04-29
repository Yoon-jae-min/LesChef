"use client";

// 동적 렌더링 강제 (useSearchParams 이슈 방지)
export const dynamic = "force-dynamic";

import Top from "@/components/common/navigation/Top";
import { useState, useEffect } from "react";
import { fetchBoardDetail, updateBoard } from "@/utils/api/board";
import { assertApiJsonSuccess } from "@/utils/helpers/apiJsonResponse";
import { reportActionFailure } from "@/utils/helpers/actionFailure";

export default function BoardEditPage() {
  const [postId, setPostId] = useState<string | null>(null);
  const [boardType, setBoardType] = useState<string>("notice");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loadReady, setLoadReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const type = params.get("type") || "notice";

    if (!id) {
      window.location.href = `/board/${type}`;
      return;
    }

    setPostId(id);
    setBoardType(type);

    let cancelled = false;

    (async () => {
      setLoadReady(false);
      try {
        const res = await fetchBoardDetail(id);
        if (cancelled) return;
        setTitle(res.content.title ?? "");
        setContent(res.content.content ?? "");
        const bt = res.content.boardType === "free" ? "free" : "notice";
        setBoardType(bt);
        setLoadReady(true);
      } catch (error) {
        if (cancelled) return;
        if (process.env.NODE_ENV === "development") {
          console.error("게시글 로드 실패:", error);
        }
        reportActionFailure(error, { redirect: `/board/${type}` });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const categoryName = boardType === "free" ? "자유게시판" : "공지사항";

  const handleUpdateBoard = async () => {
    if (isSubmitting) return;
    if (!postId) {
      alert("게시글 ID가 없습니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateBoard({
        id: postId,
        title,
        content,
      });

      await assertApiJsonSuccess(response, "ok");
      if (typeof window !== "undefined" && postId) {
        window.location.href = `/board/detail?id=${postId}&type=${boardType}`;
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("게시글 수정 실패:", error);
      }
      reportActionFailure(error, { redirect: "back" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleUpdateBoard();
  };

  return (
    <div className="min-h-screen bg-white">
      <Top />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <header className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-600/90">
            Board Edit
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            게시글 수정
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
            내용을 다듬고 저장할 수 있어요.
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

        {!loadReady ? (
          <div
            className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-[28px] border border-stone-200/90 bg-white/80 px-6 py-16 shadow-sm ring-1 ring-stone-900/[0.03]"
            role="status"
            aria-live="polite"
          >
            <span className="h-9 w-9 animate-spin rounded-full border-2 border-stone-200 border-t-orange-500" />
            <p className="text-sm text-stone-600">게시글을 불러오는 중입니다…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-[28px] border border-stone-200/90 bg-white/95 p-6 shadow-sm ring-1 ring-stone-900/[0.03] sm:p-8">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="board-edit-title"
                    className="mb-2 block text-sm font-medium text-stone-800"
                  >
                    제목
                  </label>
                  <input
                    id="board-edit-title"
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
                    htmlFor="board-edit-body"
                    className="mb-2 block text-sm font-medium text-stone-800"
                  >
                    내용
                  </label>
                  <textarea
                    id="board-edit-body"
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
                disabled={isSubmitting}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
                  isSubmitting
                    ? "cursor-not-allowed bg-orange-400"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {isSubmitting && (
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white"
                    aria-hidden
                  />
                )}
                {isSubmitting ? "저장 중…" : "수정 완료"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
