"use client";

export default function InfoPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {/* 왼쪽: 사용자 정보 */}
      <div className="md:col-span-1">
        {/* 사용자 아바타 */}
        <div className="flex flex-col items-center mt-4 mb-6 md:mt-6">
          <div className="w-56 h-56 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-28 h-28 text-gray-400">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div className="text-lg font-medium text-black mb-6">user</div>
        </div>

        {/* 버튼들 */}
        <div className="space-y-3 flex flex-col items-center">
          <button className="w-5/6 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            정보확인
          </button>
          <button className="w-5/6 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            정보변경
          </button>
          <button className="w-5/6 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            비밀번호 변경
          </button>
        </div>
      </div>

      {/* 오른쪽: 컨텐츠 섹션 */}
      <div className="md:col-span-2 space-y-6 md:space-y-8 mt-6 md:mt-0">
        {/* 기한 임박 물품 */}
        <div>
          <h2 className="text-lg md:text-xl font-bold text-black mb-3 md:mb-4">기한 임박 물품</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 md:p-8 min-h-[180px] md:min-h-[200px] flex items-center justify-center">
            <p className="text-gray-400 text-sm md:text-base">내용 없음</p>
          </div>
        </div>

        {/* 나의 인기 레시피 */}
        <div>
          <h2 className="text-lg md:text-xl font-bold text-black mb-3 md:mb-4">나의 인기 레시피</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 md:p-8 min-h-[180px] md:min-h-[200px] flex items-center justify-center">
            <p className="text-gray-400 text-sm md:text-base">내용 없음</p>
          </div>
        </div>
      </div>
    </div>
  );
}
