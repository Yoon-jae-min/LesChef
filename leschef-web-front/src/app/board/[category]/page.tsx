"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BoardCategoryPage() {
  const pathname = usePathname();
  const currentCategory = pathname.split("/").pop() || "notice";

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 15 }, (_, index) => (
        <Link
          key={index}
          href={`/board/detail?type=${currentCategory}`}
          className="border border-gray-200 p-4 bg-white hover:shadow-md transition-shadow rounded-lg block"
        >
          {/* 제목과 날짜 */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-black">---제목---</h3>
            <span className="text-xs text-gray-400">날짜&시간</span>
          </div>

          {/* 내용과 이미지 영역 */}
          <div className="flex justify-between items-start mb-3">
            <p className="text-sm text-black flex-1 mr-2">---내용---</p>
            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center">
              <span className="text-xs text-gray-400 text-center">
                이미지 영역<br />(존재시)
              </span>
            </div>
          </div>

          {/* 사용자 아이디 */}
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
            <span className="text-xs text-gray-400">아이디</span>
          </div>
        </Link>
      ))}
    </section>
  );
}
