"use client";

// 동적 렌더링 강제 (useSearchParams 이슈 방지)
export const dynamic = 'force-dynamic';

import Link from "next/link";
import Top from "@/components/common/navigation/Top";
import { useEffect, useState } from "react";
import { login } from "@/utils/api/auth";
import { STORAGE_KEYS } from "@/constants/storage/storageKeys";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saveSession, setSaveSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromMyPage, setFromMyPage] = useState(false);
  const [returnTo, setReturnTo] = useState<string>("/");
  const [showPassword, setShowPassword] = useState(false);

  // URL 파라미터에서 정보 가져오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const fromParam = params.get("from");
      const backParam = params.get("back");

      const savedReturn = sessionStorage.getItem(STORAGE_KEYS.RETURN_TO);
      const savedFrom = sessionStorage.getItem(STORAGE_KEYS.FROM_SOURCE);

      let isFromMyPage = false;
      if (fromParam === "mypage" || savedFrom === "mypage") {
        isFromMyPage = true;
        setFromMyPage(true);
        sessionStorage.setItem(STORAGE_KEYS.FROM_SOURCE, "mypage");
      }

      if (backParam) {
        sessionStorage.setItem(STORAGE_KEYS.RETURN_TO, backParam);
        setReturnTo(backParam);
      } else if (savedReturn) {
        setReturnTo(savedReturn);
      } else if (isFromMyPage) {
        setReturnTo("/myPage");
      }
    }
  }, []);

  // 로그인 제출 함수
  const handleLogin = async () => {
    setError(null);

    try {
      const result = await login({
        customerId: email, // 이메일을 customerId로 사용
        customerPwd: password,
      });

      if (result.text === "login Success") {
        // 로그인 성공 시 처리
        // 세션 쿠키가 자동으로 설정되므로 별도로 저장할 필요 없음
        setError(null);

        if (typeof window !== 'undefined') {
          const target = fromMyPage ? "/myPage" : returnTo;

          // 프론트 로그인 상태 플래그 및 사용자 정보 저장
          try {
            localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, "true");
            localStorage.setItem(
              STORAGE_KEYS.CURRENT_USER,
              JSON.stringify({
                id: result.id,
                name: result.name,
                nickName: result.nickName,
                tel: result.tel,
              }),
            );
          } catch {
            // 스토리지 사용 불가한 환경에서는 무시
          }

          sessionStorage.removeItem(STORAGE_KEYS.RETURN_TO);
          sessionStorage.removeItem(STORAGE_KEYS.FROM_SOURCE);
          window.location.href = target;
        }
      } else {
        throw new Error("로그인에 실패했습니다.");
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("로그인 실패:", error);
      }
      setError(error instanceof Error ? error.message : "아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleLogin();
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
          <section className="bg-white border border-gray-200 rounded-[32px] px-8 py-10 lg:px-12 lg:py-12 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
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
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력해주세요"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 pr-12 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-xs text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? "숨기기" : "보기"}
                  </button>
                </div>
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
                  <Link href="/find-id" className="hover:text-black transition">
                    아이디 찾기
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link href="/find-password" className="hover:text-black transition">
                    비밀번호 찾기
                  </Link>
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
                  className="rounded-2xl border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:border-gray-400 hover:text-black transition"
                >
                  {provider}
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-gray-50 px-5 py-4 text-sm text-gray-600">
              <p>
                아직 회원이 아니신가요?{" "}
                <Link
                  href="/signup"
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

