"use client";

import Top from "@/components/common/top";
import { useState, useEffect } from "react";
import { getIngredientPrices, type IngredientPriceItem } from "@/utils/ingredientPriceApi";

function Home() {
  // Always start with true to ensure server and client initial render match
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [ingredientPrices, setIngredientPrices] = useState<IngredientPriceItem[]>([]);
  const [priceLoading, setPriceLoading] = useState(true);

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

  // 식재료 물가 정보 가져오기
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setPriceLoading(true);
        const response = await getIngredientPrices();
        if (!response.error && response.data) {
          setIngredientPrices(response.data);
        }
      } catch (error) {
        console.error("식재료 물가 정보를 가져오는 중 오류:", error);
        // 오류 발생 시 빈 배열 유지
      } finally {
        setPriceLoading(false);
      }
    };

    if (isClient && !isLoading) {
      fetchPrices();
    }
  }, [isClient, isLoading]);

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
          {/* 히어로 섹션 */}
          <section className="rounded-[32px] border border-gray-200 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 p-12 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                나만의 요리 여정을 시작하세요
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                냉장고 속 재료로 만들 수 있는 레시피를 찾고, 유통기한을 관리하며, 
                요리의 모든 것을 LesChef와 함께하세요.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <a
                  href="/recipe/korean"
                  className="rounded-2xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  레시피 둘러보기 →
                </a>
                <a
                  href="/myPage/storage"
                  className="rounded-2xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  내 냉장고 관리 →
                </a>
              </div>
            </div>
          </section>

          {/* 뉴스/소식 영역 */}
          <section className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">뉴스 / 소식</h2>
              <p className="text-sm text-gray-500">LesChef의 최신 소식과 업데이트를 확인하세요</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">소식 제목 {item}</h3>
                    <span className="text-xs text-gray-400">2024.01.01</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    소식 내용이 여기에 표시됩니다. LesChef의 새로운 기능이나 업데이트 정보를 확인할 수 있어요.
                  </p>
                </div>
              ))}
            </div>
          </section>
          
          {/* 식재료 물가 관련 영역 */}
          <section className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">식재료 물가 정보</h2>
              <p className="text-sm text-gray-500">
                {priceLoading ? "최신 식재료 가격 정보를 불러오는 중..." : "최신 식재료 가격 정보를 확인하세요"}
              </p>
            </div>
            {priceLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-5 text-center animate-pulse"
                  >
                    <div className="h-8 w-8 bg-gray-300 rounded-full mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-16 mx-auto mb-1"></div>
                    <div className="h-3 bg-gray-300 rounded w-20 mx-auto"></div>
                  </div>
                ))}
              </div>
            ) : ingredientPrices.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ingredientPrices.slice(0, 8).map((item, idx) => {
                  const isPositive = (item.change || 0) > 0;
                  const isNegative = (item.change || 0) < 0;
                  const changeText = item.change 
                    ? `${isPositive ? '↑' : isNegative ? '↓' : ''} ${Math.abs(item.change).toLocaleString()}원`
                    : '-';
                  
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-gray-200 bg-gradient-to-br from-orange-50 to-yellow-50 p-5 text-center hover:shadow-md transition-shadow"
                    >
                      <div className="text-2xl mb-2">🥘</div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-gray-900">
                          {item.price.toLocaleString()}원
                        </p>
                        <p className="text-xs text-gray-600">{item.unit}</p>
                        {item.change !== undefined && (
                          <p className={`text-xs font-medium ${
                            isPositive ? 'text-red-600' : isNegative ? 'text-blue-600' : 'text-gray-600'
                          }`}>
                            {changeText}
                            {item.changeRate !== undefined && item.changeRate !== 0 && (
                              <span> ({item.changeRate > 0 ? '+' : ''}{item.changeRate.toFixed(1)}%)</span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>식재료 물가 정보를 불러올 수 없습니다.</p>
                <p className="text-sm mt-2">잠시 후 다시 시도해주세요.</p>
              </div>
            )}
          </section>

          {/* 빠른 링크 */}
          <section className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">빠른 링크</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "한식 레시피", href: "/recipe/korean", emoji: "🍲" },
                { name: "일식 레시피", href: "/recipe/japanese", emoji: "🍱" },
                { name: "중식 레시피", href: "/recipe/chinese", emoji: "🥟" },
                { name: "양식 레시피", href: "/recipe/western", emoji: "🍝" },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 text-center hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="text-3xl mb-2">{link.emoji}</div>
                  <p className="text-sm font-semibold text-gray-900">{link.name}</p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Home;
