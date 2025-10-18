"use client";

import Top from "@/components/common/top";
import { useState, useEffect } from "react";

function Home() {
  // Always start with true to ensure server and client initial render match
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 클라이언트 사이드임을 표시
    setIsClient(true);
    
    // URL 파라미터나 세션에서 로고 클릭 여부 확인
    const urlParams = new URLSearchParams(window.location.search);
    const fromLogo = urlParams.get('fromLogo') === 'true' || 
                     sessionStorage.getItem('fromLogoClick') === 'true';
    
    if (fromLogo) {
      // 로고를 통해 온 경우 애니메이션 없이 바로 로딩 완료
      setIsLoading(false);
      // 세션에서 로고 클릭 플래그 제거
      sessionStorage.removeItem('fromLogoClick');
    } else {
      // 일반 방문인 경우 애니메이션을 2초간 표시
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex items-center justify-center relative overflow-hidden">
        {/* 배경 애니메이션 요소들 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-4 h-4 bg-orange-200 rounded-full animate-float" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-yellow-200 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-red-200 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-orange-200 rounded-full animate-float" style={{animationDelay: '0.5s'}}></div>
        </div>

        <div className="text-center relative z-10">
          {/* 로고 애니메이션 - 더 역동적 */}
          <div className="mb-12 animate-logo-entrance">
            <img 
              src="/icon/LesChef_Logo.png" 
              alt="LesChef Logo" 
              className="h-28 w-auto mx-auto drop-shadow-xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {/* 요리 아이콘들 - 회전하는 애니메이션 */}
          <div className="flex justify-center mb-8 space-x-6">
            <div className="animate-spin-slow">
              <img src="/icon/chef_hat.png" alt="셰프 모자" className="w-8 h-8" />
            </div>
            <div className="animate-pulse-gentle">
              <img src="/icon/refrige.png" alt="냉장고" className="w-8 h-8" />
            </div>
            <div className="animate-bounce-gentle">
              <img src="/icon/food.png" alt="음식" className="w-8 h-8" />
            </div>
          </div>
          
          {/* 역동적인 점 애니메이션 */}
          <div className="flex justify-center mb-6 space-x-3">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-bounce-wave" style={{animationDelay: '0ms'}}></div>
            <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full animate-bounce-wave" style={{animationDelay: '200ms'}}></div>
            <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce-wave" style={{animationDelay: '400ms'}}></div>
          </div>
          
          {/* 생동감 있는 텍스트 */}
          <p className="text-gray-600 text-base font-medium tracking-wide animate-text-glow">
            🍳 요리와 식재료의 모든 것을 준비하고 있습니다 ✨
          </p>
        </div>
        
        <style jsx>{`
          @keyframes logo-entrance {
            0% {
              opacity: 0;
              transform: translateY(-30px) scale(0.8);
            }
            50% {
              opacity: 0.8;
              transform: translateY(-10px) scale(1.05);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
            }
          }
          
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          @keyframes pulse-gentle {
            0%, 100% {
              transform: scale(1);
              opacity: 0.8;
            }
            50% {
              transform: scale(1.1);
              opacity: 1;
            }
          }
          
          @keyframes bounce-gentle {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          @keyframes bounce-wave {
            0%, 100% {
              transform: translateY(0) scale(1);
            }
            25% {
              transform: translateY(-15px) scale(1.1);
            }
            50% {
              transform: translateY(-25px) scale(1.2);
            }
            75% {
              transform: translateY(-15px) scale(1.1);
            }
          }
          
          @keyframes text-glow {
            0%, 100% {
              opacity: 0.7;
              text-shadow: 0 0 5px rgba(0,0,0,0.1);
            }
            50% {
              opacity: 1;
              text-shadow: 0 0 10px rgba(255,165,0,0.3);
            }
          }
          
          .animate-logo-entrance {
            animation: logo-entrance 1.5s ease-out;
          }
          
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
          
          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }
          
          .animate-pulse-gentle {
            animation: pulse-gentle 2s ease-in-out infinite;
          }
          
          .animate-bounce-gentle {
            animation: bounce-gentle 2.5s ease-in-out infinite;
          }
          
          .animate-bounce-wave {
            animation: bounce-wave 1.5s ease-in-out infinite;
          }
          
          .animate-text-glow {
            animation: text-glow 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <Top />
      
      {/* 메인 콘텐츠 */}
      <main className="max-w-6xl mx-auto px-8 py-16">
        <div className="space-y-12">
          {/* 뉴스/소식 영역 */}
          <div className="w-full border border-black rounded-none p-16 min-h-[280px] flex items-center justify-center bg-white">
            <h2 className="text-xl font-medium text-black">뉴스 / 소식 영역</h2>
          </div>
          
          {/* 식재료 물가 관련 영역 */}
          <div className="w-full border border-black rounded-none p-16 min-h-[280px] flex items-center justify-center bg-white">
            <h2 className="text-xl font-medium text-black">식재료 물가 관련 영역</h2>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
