"use client";

import Top from "@/components/common/top";
import ScrollToTop from "@/components/common/ScrollToTop";
import { useState } from "react";

function RecipeDetailPage() {
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      username: "아이디",
      time: "시간",
      content: "댓글 내용",
    },
    {
      id: 2,
      username: "아이디",
      time: "시간", 
      content: "댓글 내용",
    }
  ]);

  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        username: "아이디",
        time: "시간",
        content: comment.trim(),
      };
      setComments([...comments, newComment]);
      setComment("");
    }
  };

  const handleDeleteComment = (id: number) => {
    setComments(comments.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-white">
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
      
      <main className="max-w-2xl lg:max-w-6xl mx-auto px-8 py-8 lg:h-[calc(100vh-80px)] lg:overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:h-full">
          {/* 왼쪽: 레시피 메인 정보 */}
          <div className="space-y-6 lg:overflow-y-auto lg:pr-2">
            {/* 레시피 제목 */}
            <div className="flex items-center justify-between rounded-[32px] border border-gray-200 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
              <h1 className="text-4xl font-bold text-black">Example</h1>
              
              {/* 좋아요 버튼 */}
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`w-8 h-8 flex items-center justify-center transition-colors ${
                  isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <svg 
                  viewBox="0 0 24 24" 
                  fill={isLiked ? 'currentColor' : 'none'} 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  className="w-6 h-6"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
            
            {/* 레시피 이미지 */}
            <div className="w-full aspect-square relative rounded-[32px] border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden shadow-[6px_6px_0_rgba(0,0,0,0.05)] flex items-center justify-center">
              <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                <span className="text-5xl">📷</span>
                <span className="text-sm">레시피 이미지</span>
              </div>
            </div>
            
            {/* 레시피 메타데이터 */}
            <div className="w-full flex items-center justify-center py-4 rounded-[32px] border border-gray-200 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
              <div className="flex items-center space-x-6 sm:space-x-10 lg:space-x-12 text-base sm:text-lg lg:text-xl font-bold text-black">
                <span>한식 &gt; 국</span>
                <div className="h-8 sm:h-10 lg:h-12 border-l border-gray-300"></div>
                <span>2인분</span>
                <div className="h-8 sm:h-10 lg:h-12 border-l border-gray-300"></div>
                <span>25분</span>
              </div>
            </div>
          </div>

          {/* 오른쪽: 재료, 단계, 댓글 */}
          <div className="space-y-8 lg:overflow-y-auto lg:pr-2">
            {/* 재료 섹션 */}
            <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
              <h2 className="text-2xl font-bold text-black pb-1 mb-4 text-center">
                <span className="border-b-2 border-gray-300 px-1">Ingredient</span>
              </h2>
              
              {/* 기본재료 */}
              <div className="mb-6">
                <button className="px-4 py-2 text-gray-700 rounded-2xl text-base font-medium mb-4 border border-gray-300 bg-white hover:bg-gray-50 transition-colors">
                  기본재료
                </button>
                <div className="space-y-3 pl-4">
                  {[1, 2].map((item) => (
                    <div key={item} className="flex items-center justify-between text-base rounded-xl border border-gray-200 bg-gray-50 px-4 py-2">
                      <div className="text-gray-900 font-medium">재료</div>
                      <div className="flex items-center space-x-6">
                        <div className="text-gray-900 font-medium">양</div>
                        <div className="text-gray-900 font-medium">단위</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 국물재료 */}
              <div>
                <button className="px-4 py-2 text-gray-700 rounded-2xl text-base font-medium mb-4 border border-gray-300 bg-white hover:bg-gray-50 transition-colors">
                  국물재료
                </button>
                <div className="space-y-3 pl-4">
                  <div className="flex items-center justify-between text-base rounded-xl border border-gray-200 bg-gray-50 px-4 py-2">
                    <div className="text-gray-900 font-medium">재료</div>
                    <div className="flex items-center space-x-6">
                      <div className="text-gray-900 font-medium">양</div>
                      <div className="text-gray-900 font-medium">단위</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 단계 섹션 */}
            <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
              <h2 className="text-2xl font-bold text-black pb-1 mb-4 text-center">
                <span className="border-b-2 border-gray-300 px-1">Step</span>
              </h2>
              
              <div className="space-y-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="border border-gray-200 rounded-2xl p-4 bg-gradient-to-br from-gray-50 to-white">
                    <div className="flex items-start space-x-6">
                      <div className="w-24 h-24 relative flex-shrink-0 rounded-xl border border-gray-200 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-2xl text-gray-400">📷</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-black mb-3">Step. {step}</h3>
                        <div className="w-full min-h-[60px] border-2 border-dashed border-gray-300 rounded-xl flex items-center px-4 bg-white">
                          <span className="text-gray-500 text-base">내용</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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

export default RecipeDetailPage;

