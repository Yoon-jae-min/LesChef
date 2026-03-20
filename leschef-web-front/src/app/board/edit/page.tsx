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
    if (!postId) {
      alert("게시글 ID가 없습니다.");
      return;
    }

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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleUpdateBoard();
  };

  return (
    <div className="min-h-screen bg-white">
      <Top />
      <main className="max-w-4xl mx-auto px-8 py-12">
        <div className="mb-8 rounded-[32px] border border-gray-200 bg-white px-6 py-5 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-600">
              {categoryName}
            </span>
            <p className="text-xs font-medium uppercase tracking-[0.4em] text-gray-400">
              Board Edit
            </p>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">게시글 수정</h1>
          <p className="text-xs text-gray-500 mt-1">게시글 내용을 수정해보세요.</p>
        </div>

        {!loadReady ? (
          <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
            게시글을 불러오는 중입니다…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력하세요..."
                    rows={15}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0 resize-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.history.back();
                  }
                }}
                className="rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
              >
                취소
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-gray-700 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition"
              >
                수정 완료
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
