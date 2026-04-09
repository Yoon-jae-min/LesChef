"use client";

import Link from "next/link";
import Top from "@/components/common/navigation/Top";
import { useState } from "react";
import { findIdByProfile } from "@/utils/api/auth";

export default function FindIdPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [foundMaskedId, setFoundMaskedId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setFoundMaskedId(null);
    setIsSearching(true);

    try {
      const result = await findIdByProfile(name, phone);
      setFoundMaskedId(result.maskedId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "아이디를 찾을 수 없습니다.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <Top />

      <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <section className="relative overflow-hidden rounded-[32px] border border-gray-200 bg-white px-10 py-12 shadow-[6px_6px_0_rgba(0,0,0,0.05)] lg:px-14 lg:py-16">
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br from-orange-200 to-red-200 opacity-70 blur-3xl" />
            <div className="pointer-events-none absolute -left-6 bottom-8 h-20 w-20 rounded-full bg-gradient-to-br from-yellow-200 to-orange-200 opacity-60 blur-2xl" />

            <p className="inline-flex items-center text-sm uppercase tracking-[0.2em] text-gray-500">
              Find Account
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-gray-900 lg:text-5xl">
              아이디를
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-red-400 to-yellow-400 bg-clip-text text-transparent">
                찾아보세요
              </span>
            </h1>

            <p className="mt-6 text-base leading-relaxed text-gray-600">
              가입 시 등록한 이름과 전화번호로 조회합니다. 아이디는 일부만 표시됩니다.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "가입 시 등록한 정보로 찾기",
                "개인정보 보호를 위해 아이디 마스킹",
                "찾은 아이디로 로그인 시도",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-gray-800">
                  <span className="mt-1 h-2 w-2 rounded-full bg-black" />
                  <p className="text-sm leading-relaxed lg:text-base">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-gray-200 bg-white px-8 py-10 shadow-[6px_6px_0_rgba(0,0,0,0.05)] lg:px-12 lg:py-12">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-gray-900">아이디 찾기</h2>
              <p className="text-sm text-gray-500">등록된 이름과 전화번호를 입력해주세요.</p>
            </div>

            {foundMaskedId ? (
              <div className="mt-8 space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-8 text-center">
                  <div className="mb-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <svg
                        className="h-8 w-8 text-green-600"
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
                  <p className="mb-2 text-sm text-gray-600">등록된 아이디 (일부 숨김)</p>
                  <p className="mb-6 text-lg font-semibold text-gray-900">{foundMaskedId}</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          window.location.href = "/login";
                        }
                      }}
                      className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                    >
                      로그인하기
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFoundMaskedId(null);
                        setName("");
                        setPhone("");
                      }}
                      className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                    >
                      다시 찾기
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">이름</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="가입 시 등록한 이름"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-600 focus:border-gray-400 focus:ring-0"
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">전화번호</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010-1234-5678"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-600 focus:border-gray-400 focus:ring-0"
                    required
                    autoComplete="tel"
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full rounded-2xl bg-black py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSearching ? "찾는 중..." : "아이디 찾기"}
                </button>
              </form>
            )}

            <div className="mt-8 flex items-center justify-center gap-4 text-sm">
              <Link href="/login" className="text-gray-600 transition hover:text-black">
                로그인
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/find-password" className="text-gray-600 transition hover:text-black">
                비밀번호 찾기
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/signup" className="text-gray-600 transition hover:text-black">
                회원가입
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
