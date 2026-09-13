"use client";

// 동적 렌더링 강제 (useSearchParams 이슈 방지)
export const dynamic = "force-dynamic";

import Top from "@/components/common/navigation/Top";
import CitrusPageBanner from "@/components/common/ui/CitrusPageBanner";
import { useState, useEffect } from "react";
import { createBoard } from "@/utils/api/board";
import { assertApiJsonSuccess } from "@/utils/helpers/apiJsonResponse";
import { reportActionFailure } from "@/utils/helpers/actionFailure";
import { checkLoginStatus, isCurrentUserAdmin } from "@/utils/helpers/authUtils";

export default function BoardWritePage() {
  const [boardType, setBoardType] = useState<string>("notice");
  const [gateReady, setGateReady] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // URL 파라미터 + 공지 관리자 게이트
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type") === "free" ? "free" : "notice";
    setBoardType(type);

    if (!checkLoginStatus()) {
      window.location.href = `/login?back=${encodeURIComponent(`/board/write?type=${type}`)}`;
      return;
    }

    if (type === "notice" && !isCurrentUserAdmin()) {
      setBlocked(true);
      setGateReady(true);
      return;
    }

    setBlocked(false);
    setGateReady(true);
  }, []);

  const categoryName = boardType === "free" ? "자유게시판" : "공지사항";

  const handleSubmitBoard = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmitBoard();
  };

  if (!gateReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-green-600" />
      </div>
    );
  }

  if (blocked) {
    return (
      <div className="min-h-screen bg-white">
        <Top />
        <main className="mx-auto max-w-lg px-6 py-20 text-center">
          <h1 className="text-xl font-semibold text-stone-900">공지 작성 권한 없음</h1>
          <p className="mt-3 text-sm text-stone-600">
            공지사항은 관리자만 작성할 수 있습니다.
          </p>
          <a
            href="/board/notice"
            className="mt-8 inline-flex rounded-2xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
          >
            공지 목록으로
          </a>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Top />
      <CitrusPageBanner
        eyebrow="Board Write"
        title="게시글 작성"
        description="커뮤니티에 글을 남겨 보세요."
        size="compact"
      />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span
            className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold ${
              boardType === "free"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-700"
            }`}
          >
            {categoryName}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-[28px] border border-stone-200/90 bg-white p-6 shadow-sm sm:p-8">
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
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50/30 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-green-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/25"
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
                  className="w-full resize-none rounded-2xl border border-stone-200 bg-stone-50/30 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-green-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/25"
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
              className="rounded-2xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 ${
                isSubmitting
                  ? "cursor-not-allowed bg-green-400"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSubmitting && (
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white"
                  aria-hidden
                />
              )}
              {isSubmitting ? "등록 중…" : "게시글 등록"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
