"use client";

import Top from "@/components/common/top";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function BoardDetailPage() {
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("공지사항");
  const searchParams = useSearchParams();
  
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

  useEffect(() => {
    const boardType = searchParams.get('type');
    if (boardType === 'free') {
      setCategory("자유게시판");
    } else {
      setCategory("공지사항");
    }
  }, [searchParams]);

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
      
      <main className="max-w-2xl lg:max-w-6xl mx-auto px-8 py-8 lg:h-[calc(100vh-80px)] lg:overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:h-full">
          {/* 왼쪽: 게시글 메인 정보 */}
          <div className="space-y-6 lg:overflow-y-auto lg:pr-2">
            {/* 카테고리 */}
            <div className="text-base font-medium text-gray-500">
              {category}
            </div>
            
            {/* 제목과 좋아요 버튼 */}
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-4xl font-bold text-black">Title</h1>
              
              {/* 좋아요 버튼 */}
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`w-8 h-8 flex items-center justify-center transition-colors ${
                  isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none"
                  stroke="currentColor" 
                  strokeWidth="2" 
                  className="w-6 h-6"
                >
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                </svg>
              </button>
            </div>
            
            {/* 구분선 */}
            <div className="w-full border-b border-gray-400 mt-0.5"></div>
            
            {/* 게시글 내용 */}
            <div className="space-y-4 mt-6">
              <div className="text-base text-gray-800 leading-relaxed">
                <p className="mb-4">
                  안녕하세요. LesChef 공지사항입니다.
                </p>
                <p className="mb-4">
                  새로운 기능이 추가되었습니다. 레시피 검색 기능이 개선되어 더욱 정확하고 빠른 검색이 가능해졌습니다. 
                  또한 사용자 피드백을 반영하여 UI/UX가 업데이트되었습니다.
                </p>
                <p className="mb-4">
                  앞으로도 더 나은 서비스를 제공하기 위해 지속적으로 개선해나가겠습니다. 
                  여러분의 소중한 의견과 피드백을 항상 환영합니다.
                </p>
                <p className="mb-4">
                  감사합니다.
                </p>
                <p className="text-sm text-gray-500">
                  - LesChef 개발팀 -
                </p>
              </div>
            </div>
          </div>

          {/* 오른쪽: 댓글 섹션 */}
          <div className="space-y-8 lg:overflow-y-auto lg:pr-2">
            {/* 댓글 섹션 */}
            <div>
              <h2 className="text-2xl font-bold text-black pb-1 mb-2 text-center">
                <span className="border-b border-gray-300 px-1">Comment</span>
              </h2>
              
              {/* 댓글 입력 */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="댓글을 입력해주세요"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 text-base text-black placeholder-gray-400"
                />
              </div>

              {/* 댓글 목록 */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                        <span className="text-base font-medium text-gray-700">{comment.username}</span>
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
                    <div className="w-full h-8 border-2 border-dashed border-gray-300 rounded flex items-center px-4">
                      <span className="text-gray-500 text-base">-{comment.content}-</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BoardDetailPage;
