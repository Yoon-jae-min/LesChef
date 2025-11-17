"use client";

import Link from "next/link";
import Top from "@/components/common/top";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saveSession, setSaveSession] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email === "admin@admin.com" && password === "1234") {
      localStorage.setItem("leschef_is_logged_in", "true");
      setError(null);
      router.push("/myPage");
      return;
    }

    setError("아이디 또는 비밀번호가 올바르지 않습니다.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <Top />

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 브랜드 메시지 */}
          <section className="relative overflow-hidden rounded-[32px] border border-black bg-white px-10 py-12 lg:px-14 lg:py-16 shadow-[10px_10px_0_0_rgba(0,0,0,0.08)]">
            <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-gradient-to-br from-orange-200 to-red-200 opacity-70 blur-3xl pointer-events-none" />
            <div className="absolute -left-6 bottom-8 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-200 to-orange-200 opacity-60 blur-2xl pointer-events-none" />

            <p className="inline-flex items-center text-sm uppercase tracking-[0.2em] text-gray-500">
              Welcome back
            </p>
            <h1 className="mt-4 text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight">
              나만의 요리 여정,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-400 to-yellow-400">
                LesChef{" "}
              </span>
              와{" "}
              <span className="underline decoration-4 decoration-orange-300">
                계속
              </span>
            </h1>

            <p className="mt-6 text-base text-gray-600 leading-relaxed">
              즐겨찾기, 식재료 관리, 맞춤 레시피 추천까지. 로그인하면
              나에게 딱 맞춘 LesChef의 서비스를 온전히 경험할 수 있어요.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "내 냉장고를 기반으로 한 레시피 추천",
                "게시판 글쓰기 및 커뮤니티 참여",
                "마이페이지에서 즐겨찾기와 저장함 관리",
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

          {/* 로그인 폼 */}
          <section className="bg-white border border-black rounded-[32px] px-8 py-10 lg:px-12 lg:py-12 shadow-[10px_10px_0_0_rgba(0,0,0,0.08)]">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-gray-900">
                계정으로 로그인
              </h2>
              <p className="text-sm text-gray-500">
                LesChef 서비스 이용을 위해 로그인해 주세요.
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-black focus:ring-0"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력해주세요"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-black focus:ring-0"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-gray-600">
                  <input
                    type="checkbox"
                    checked={saveSession}
                    onChange={() => setSaveSession((prev) => !prev)}
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  로그인 상태 유지
                </label>

                <div className="flex items-center gap-3 text-gray-500">
                  <button type="button" className="hover:text-black">
                    아이디 찾기
                  </button>
                  <span className="text-gray-300">|</span>
                  <button type="button" className="hover:text-black">
                    비밀번호 찾기
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <button
                type="submit"
                className="w-full rounded-2xl bg-black py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                로그인하기
              </button>
            </form>

            <div className="mt-6 flex items-center gap-4 text-xs text-gray-400">
              <span className="h-px flex-1 bg-gray-200" />
              <span>SNS 계정으로 시작</span>
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {["카카오", "네이버", "구글"].map((provider) => (
                <button
                  key={provider}
                  type="button"
                  className="rounded-2xl border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:border-black hover:text-black transition"
                >
                  {provider}
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-gray-50 px-5 py-4 text-sm text-gray-600">
              <p>
                아직 회원이 아니신가요?{" "}
                <Link
                  href="#"
                  className="font-semibold text-black underline-offset-4 hover:underline"
                >
                  회원가입
                </Link>
                으로 간편하게 시작해 보세요.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

