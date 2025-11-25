"use client";

import Link from "next/link";
import Top from "@/components/common/top";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FindIdPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [foundEmail, setFoundEmail] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setFoundEmail(null);
    setIsSearching(true);

    // TODO: API 연동
    // 실제로는 서버에서 이름과 전화번호로 이메일을 찾아야 함
    
    // Mock: 검색 시뮬레이션
    setTimeout(() => {
      setIsSearching(false);
      
      // Mock 데이터 - 실제로는 API 응답
      if (name && phone) {
        // 성공 시
        setFoundEmail("user@example.com");
      } else {
        setError("입력한 정보로 등록된 계정을 찾을 수 없습니다.");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <Top />

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 브랜드 메시지 */}
          <section className="relative overflow-hidden rounded-[32px] border border-gray-200 bg-white px-10 py-12 lg:px-14 lg:py-16 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
            <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-gradient-to-br from-orange-200 to-red-200 opacity-70 blur-3xl pointer-events-none" />
            <div className="absolute -left-6 bottom-8 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-200 to-orange-200 opacity-60 blur-2xl pointer-events-none" />

            <p className="inline-flex items-center text-sm uppercase tracking-[0.2em] text-gray-500">
              Find Account
            </p>
            <h1 className="mt-4 text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight">
              아이디를
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-400 to-yellow-400">
                찾아보세요
              </span>
            </h1>

            <p className="mt-6 text-base text-gray-600 leading-relaxed">
              가입 시 등록한 이름과 전화번호를 입력하시면
              등록된 이메일 주소를 확인할 수 있습니다.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "가입 시 등록한 정보로 찾기",
                "개인정보 보호를 위해 일부만 표시",
                "찾은 아이디로 바로 로그인 가능",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 text-gray-800"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-black" />
                  <p className="text-sm lg:text-base leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 아이디 찾기 폼 */}
          <section className="bg-white border border-gray-200 rounded-[32px] px-8 py-10 lg:px-12 lg:py-12 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-gray-900">
                아이디 찾기
              </h2>
              <p className="text-sm text-gray-500">
                등록된 이름과 전화번호를 입력해주세요.
              </p>
            </div>

            {foundEmail ? (
              <div className="mt-8 space-y-6">
                <div className="rounded-2xl bg-gray-50 border border-gray-200 px-6 py-8 text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">등록된 이메일 주소</p>
                  <p className="text-lg font-semibold text-gray-900 mb-6">
                    {foundEmail}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => router.push("/login")}
                      className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
                    >
                      로그인하기
                    </button>
                    <button
                      onClick={() => {
                        setFoundEmail(null);
                        setName("");
                        setPhone("");
                      }}
                      className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
                    >
                      다시 찾기
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    이름
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="가입 시 등록한 이름"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    전화번호
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010-1234-5678"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full rounded-2xl bg-black py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? "찾는 중..." : "아이디 찾기"}
                </button>
              </form>
            )}

            <div className="mt-8 flex items-center justify-center gap-4 text-sm">
              <Link
                href="/login"
                className="text-gray-600 hover:text-black transition"
              >
                로그인
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                href="/find-password"
                className="text-gray-600 hover:text-black transition"
              >
                비밀번호 찾기
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                href="/signup"
                className="text-gray-600 hover:text-black transition"
              >
                회원가입
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

