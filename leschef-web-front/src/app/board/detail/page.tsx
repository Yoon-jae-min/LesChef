"use client";

import Top from "@/components/common/top";
import ScrollToTop from "@/components/common/ScrollToTop";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchBoardDetail, createBoardComment, toggleBoardLike, type BoardDetailResponse } from "@/utils/boardApi";

function BoardDetailPage() {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("공지사항");
  const searchParams = useSearchParams();
  const postId = searchParams.get("id") || "";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<BoardDetailResponse | null>(null);
  const [comments, setComments] = useState<BoardDetailResponse["comments"]>([]);

  const handleAddComment = async () => {
    if (!comment.trim() || !postId) return;
    try {
      const response = await createBoardComment({
        boardId: postId,
        content: comment.trim(),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      // 성공 시 다시 불러오기
      setComment("");
      await loadDetail();
    } catch (err) {
      console.error(err);
      alert("댓글 작성에 실패했습니다.");
    }
  };

  const handleDeleteComment = (id: number) => {
    setComments(comments.filter(c => c.id !== id));
  };

  useEffect(() => {
    const boardType = searchParams.get('type');
    if (boardType === 'free') {
      setCategory("자유게시판");
    } else {
      setCategory("공지사항");
    }
  }, [searchParams]);

  const loadDetail = async () => {
    if (!postId) {
      setError("게시글 ID가 없습니다.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBoardDetail(postId);
      setDetail(data);
      setComments(data.comments || []);
      setIsLiked(!!data.liked);
      setLikeCount(data.likeCount || 0);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "게시글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async () => {
    if (!postId) {
      alert("게시글 ID가 없습니다.");
      return;
    }
    try {
      const result = await toggleBoardLike(postId);
      setIsLiked(result.liked);
      setLikeCount(result.likeCount);
    } catch (err) {
      console.error(err);
      alert("좋아요 처리에 실패했습니다. 로그인 상태를 확인해주세요.");
    }
  };

  useEffect(() => {
    loadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  return (
    <div className="min-h-screen lg:h-screen bg-white lg:overflow-hidden">
      <style jsx global>{`
        /* 스크롤바 스타일링 */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }
      `}</style>
      <Top />

      {loading && (
        <div className="max-w-4xl mx-auto px-6 py-8 text-sm text-gray-500">게시글을 불러오는 중입니다...</div>
      )}
      {error && !loading && (
        <div className="max-w-4xl mx-auto px-6 py-8 text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl">
          {error}
        </div>
      )}
      
      <main className="max-w-2xl lg:max-w-6xl mx-auto px-8 py-8 lg:h-[calc(100vh-80px)] lg:overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:h-full">
          {/* 왼쪽: 게시글 메인 정보 */}
          <div className="space-y-6 lg:overflow-y-auto lg:pr-2">
            {/* 제목 영역 */}
            <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500 px-3 py-1 rounded-full bg-gray-100">
                  {category}
                </span>
                <div className="flex items-center gap-3">
                  {/* 편집 버튼 */}
                  <Link
                    href={`/board/edit?id=${postId}&type=${searchParams.get('type') || 'notice'}`}
                    className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
                  >
                    편집
                  </Link>
                  
                  {/* 좋아요 버튼 */}
                  <button
                    onClick={handleToggleLike}
                    className={`w-9 h-9 flex items-center justify-center gap-1 rounded-full border transition-colors ${
                      isLiked ? 'text-red-500 border-red-200 bg-red-50' : 'text-gray-400 border-gray-200 hover:text-red-500 hover:border-red-200'
                    }`}
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      fill={isLiked ? 'currentColor' : 'none'}
                      stroke="currentColor" 
                      strokeWidth="2" 
                      className="w-5 h-5"
                    >
                      <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"/>
                    </svg>
                    <span className="text-xs font-semibold">{likeCount}</span>
                  </button>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-black">{detail?.content?.title || "게시글"}</h1>
            </div>
            
            {/* 게시글 내용 */}
            <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
              <div className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
                {detail?.content?.content || "내용이 없습니다."}
              </div>
            </div>
          </div>

          {/* 오른쪽: 댓글 섹션 */}
          <div className="space-y-8 lg:overflow-y-auto lg:pr-2">
            {/* 댓글 섹션 */}
            <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
              <h2 className="text-2xl font-bold text-black pb-1 mb-4 text-center">
                <span className="border-b-2 border-gray-300 px-1">Comment</span>
              </h2>
              
              {/* 댓글 입력 */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="댓글을 입력해주세요"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-300 text-base"
                />
              </div>

              {/* 댓글 목록 */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center border border-gray-400">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                        <span className="text-base font-medium text-gray-900">{comment.username}</span>
                        <span className="text-base text-gray-500">-{comment.time}-</span>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6"/>
                        </svg>
                      </button>
                    </div>
                    <div className="w-full min-h-[40px] border-2 border-dashed border-gray-300 rounded-xl flex items-center px-4 bg-white">
                      <span className="text-gray-700 text-base">-{comment.content}-</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <ScrollToTop />
    </div>
  );
}

export default BoardDetailPage;
