/**
 * 서비스 소개 및 CTA 섹션
 */

"use client";

import Link from "next/link";

export default function ServiceIntro() {
  const features = [
    {
      icon: "🍳",
      title: "재료 기반 검색",
      description: "보유한 재료로 만들 수 있는 레시피를 찾아보세요",
    },
    {
      icon: "📅",
      title: "유통기한 관리",
      description: "식재료 유통기한을 관리하여 음식 낭비를 줄이세요",
    },
    {
      icon: "👥",
      title: "레시피 공유",
      description: "나만의 레시피를 공유하고 다른 사람의 레시피를 즐기세요",
    },
    {
      icon: "⭐",
      title: "평점 및 리뷰",
      description: "레시피에 평점과 리뷰를 남겨 다른 사용자에게 도움을 주세요",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            LesChef와 함께
            <br />
            더 스마트한 주방을 만들어보세요
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            보유한 재료를 활용하고, 유통기한을 관리하며,
            <br />
            다양한 레시피를 공유하는 레시피 플랫폼
          </p>
        </div>

        {/* 기능 소개 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-[32px] border border-gray-200 p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)] hover:shadow-[8px_8px_0_rgba(0,0,0,0.05)] transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA 버튼 */}
        <div className="text-center">
          <Link
            href="/myPage/recipes/write"
            className="inline-block px-8 py-4 bg-orange-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            지금 시작하기
          </Link>
        </div>
      </div>
    </section>
  );
}

