"use client";

import Image from "next/image";
import Link from "next/link";

export default function FavoritesCategoryPage() {
  const placeholderCards = Array.from({ length: 15 }).map((_, idx) => ({ id: idx + 1 }));

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-10">
      {placeholderCards.map((card) => (
        <Link
          key={card.id}
          href="/recipe/detail"
          className="flex flex-col group focus:outline-none focus:ring-2 focus:ring-black rounded-sm"
          aria-label={`레시피 ${card.id} 상세로 이동`}
        >
          <div className="w-full aspect-square relative cursor-pointer">
            <Image
              src="/common/noImage.png"
              alt="이미지 없음"
              fill
              className="object-contain transition-transform group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              priority={card.id <= 5}
            />
          </div>
          <div className="mt-2 text-sm text-gray-800 text-center">example</div>
          <div className="mt-1 flex items-center justify-between px-1 text-[11px] text-gray-400">
            <div className="flex items-center space-x-1">
              <span className="inline-block w-3 h-3 rounded-full border border-gray-300" />
              <span>정보</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="inline-block w-3 h-3 rounded-full border border-gray-300" />
              <span>time</span>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}
