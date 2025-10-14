import Top from "@/components/common/top";

function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <Top />
      
      {/* 메인 콘텐츠 */}
      <main className="max-w-5xl mx-auto px-8 py-16">
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
