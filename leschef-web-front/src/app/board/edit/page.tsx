"use client";

import Top from "@/components/common/Top";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { updateBoard } from "@/utils/boardApi";

export default function BoardEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  const boardType = searchParams.get("type") || "notice";
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const categoryName = boardType === "free" ? "자유게시판" : "공지사항";

  // 기존 게시글 데이터 불러오기
  useEffect(() => {
    if (!postId) {
      router.push(`/board/${boardType}`);
      return;
    }
    // 기존 게시글 데이터 로드 로직은 서버 컴포넌트에서 처리
  }, [postId, boardType, router]);

  // 게시글 수정 함수 (나중에 버튼에 연결할 때 사용)
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

      if (response.ok) {
        const result = await response.text();
        if (result === "ok") {
          // 성공 시 처리 (예: 게시글 상세 페이지로 이동)
          router.push(`/board/detail?id=${postId}&type=${boardType}`);
        } else {
          throw new Error("서버 응답 오류");
        }
      } else {
        throw new Error(`서버 오류: ${response.status}`);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("게시글 수정 실패:", error);
      }
      // 백엔드 API가 아직 없는 경우를 위한 안내 메시지
      if (error instanceof Error && error.message.includes("구현되지 않았습니다")) {
        alert("게시글 수정 기능은 백엔드 API 구현 후 사용할 수 있습니다.");
      } else {
        alert("게시글 수정에 실패했습니다. 다시 시도해주세요.");
      }
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
            <p className="text-xs font-medium uppercase tracking-[0.4em] text-gray-400">Board Edit</p>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">게시글 수정</h1>
          <p className="text-xs text-gray-500 mt-1">게시글 내용을 수정해보세요.</p>
        </div>

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
              onClick={() => router.back()}
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
      </main>
    </div>
  );
}

