"use client";

import Top from "@/components/common/top";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function BoardEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  const boardType = searchParams.get("type") || "notice";
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const categoryName = boardType === "free" ? "자유게시판" : "공지사항";

  // 기존 게시글 데이터 불러오기
  useEffect(() => {
    if (!postId) {
      router.push(`/board/${boardType}`);
      return;
    }

    // TODO: API 연동 - 실제 서버에서 게시글 데이터 가져오기
    // 현재는 mock 데이터 사용
    const loadPostData = async () => {
      setIsLoading(true);
      try {
        // const response = await fetch(`/api/board/${postId}`);
        // const data = await response.json();
        
        // Mock 데이터
        const mockData = {
          title: "게시글 제목 예시",
          content: "게시글 내용 예시입니다.\n\n여러 줄로 작성된 내용을 확인할 수 있습니다.\n\n수정할 수 있는 내용입니다.",
        };

        setTitle(mockData.title);
        setContent(mockData.content);
      } catch (error) {
        console.error("게시글 데이터 로드 실패:", error);
        alert("게시글을 불러오는데 실패했습니다.");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    loadPostData();
  }, [postId, boardType, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연동
    console.log("게시글 수정:", { postId, title, content, boardType });
    alert("게시글 수정 기능은 서버 연동 후 구현됩니다.");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Top />
        <main className="max-w-4xl mx-auto px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">게시글을 불러오는 중...</p>
          </div>
        </main>
      </div>
    );
  }

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

