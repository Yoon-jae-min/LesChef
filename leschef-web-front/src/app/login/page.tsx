"use client";

// 동적 렌더링 강제 (useSearchParams 이슈 방지)
export const dynamic = "force-dynamic";

import Link from "next/link";
import AuthCitrusShell from "@/components/common/ui/AuthCitrusShell";
import { useEffect, useState } from "react";
import { login } from "@/utils/api/auth";
import { STORAGE_KEYS } from "@/constants/storage/storageKeys";
import { getKakaoLoginUrl, getGoogleLoginUrl, getNaverLoginUrl } from "@/config/apiConfig";

const inputClass =
  "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20";

function GreenCheck() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

export default function LoginPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [saveSession, setSaveSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fromMyPage, setFromMyPage] = useState(false);
  const [returnTo, setReturnTo] = useState<string>("/");
  const [showPassword, setShowPassword] = useState(false);

  // URL 파라미터에서 정보 가져오기
  useEffect(() => {
    if (typeof window !== "undefined") {
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
    if (isSubmitting) return;
    setError(null);

    setIsSubmitting(true);
    try {
      const result = await login({
        customerId: loginId.trim(),
        customerPwd: password,
      });

      if (result.text === "login Success") {
        // 로그인 성공 시 처리
        setError(null);

        if (typeof window !== "undefined") {
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
                checkAdmin: !!result.checkAdmin,
              })
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
      setError(
        error instanceof Error ? error.message : "아이디 또는 비밀번호가 올바르지 않습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleLogin();
  };

  return (
    <AuthCitrusShell>
      <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* 브랜드 패널 */}
          <section className="relative px-2 py-4 lg:px-4 lg:py-8">
            <p className="inline-flex items-center text-sm uppercase tracking-[0.2em] text-green-700/70">
              Welcome back
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-gray-900 lg:text-5xl">
              나만의 요리 여정,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-lime-500 to-yellow-400">
                LesChef{" "}
              </span>
              와 <span className="underline decoration-4 decoration-lime-300">계속</span>
            </h1>

            <p className="mt-6 text-base leading-relaxed text-gray-600">
              즐겨찾기, 식재료 관리, 맞춤 레시피 추천까지. 로그인하면 나에게 딱 맞춘 LesChef의
              서비스를 온전히 경험할 수 있어요.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "내 냉장고를 기반으로 한 레시피 추천",
                "게시판 글쓰기 및 커뮤니티 참여",
                "마이페이지에서 즐겨찾기와 저장함 관리",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-gray-800">
                  <GreenCheck />
                  <p className="text-sm leading-relaxed lg:text-base">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 로그인 폼 */}
          <section className="rounded-[28px] border border-white/80 bg-white/95 px-8 py-10 shadow-sm backdrop-blur-sm lg:px-12 lg:py-12">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-gray-900">계정으로 로그인</h2>
              <p className="text-sm text-gray-500">LesChef 서비스 이용을 위해 로그인해 주세요.</p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">아이디</label>
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="회원가입 시 설정한 아이디"
                  className={inputClass}
                  required
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">비밀번호</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력해주세요"
                    className={`${inputClass} pr-12`}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-xs text-gray-500 hover:text-green-700"
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
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  로그인 상태 유지
                </label>

                <div className="flex items-center gap-3 text-gray-500">
                  <Link href="/find-id" className="transition hover:text-green-600">
                    아이디 찾기
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link href="/find-password" className="transition hover:text-green-600">
                    비밀번호 찾기
                  </Link>
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70 ${
                  isSubmitting ? "bg-green-700" : "bg-green-600"
                }`}
              >
                {isSubmitting && (
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white"
                    aria-hidden
                  />
                )}
                {isSubmitting ? "로그인 중…" : "로그인하기"}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-4 text-xs text-gray-400">
              <span className="h-px flex-1 bg-gray-200" />
              <span>SNS 계정으로 시작</span>
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {/* 카카오 로그인 */}
              <button
                type="button"
                onClick={() => {
                  try {
                    const kakaoUrl = getKakaoLoginUrl();
                    window.location.href = kakaoUrl;
                  } catch (error) {
                    if (error instanceof Error) {
                      setError(error.message);
                    } else {
                      setError("카카오 로그인을 시작할 수 없습니다.");
                    }
                  }
                }}
                className="rounded-2xl py-3 text-sm font-medium text-gray-900 transition hover:brightness-95"
                style={{ backgroundColor: "#FEE500" }}
              >
                카카오
              </button>

              {/* 네이버 로그인 */}
              <button
                type="button"
                onClick={() => {
                  try {
                    const naverUrl = getNaverLoginUrl();
                    window.location.href = naverUrl;
                  } catch (error) {
                    if (error instanceof Error) {
                      setError(error.message);
                    } else {
                      setError("네이버 로그인을 시작할 수 없습니다.");
                    }
                  }
                }}
                className="rounded-2xl py-3 text-sm font-medium text-white transition hover:brightness-95"
                style={{ backgroundColor: "#03C75A" }}
              >
                네이버
              </button>

              {/* 구글 로그인 */}
              <button
                type="button"
                onClick={() => {
                  try {
                    const googleUrl = getGoogleLoginUrl();
                    window.location.href = googleUrl;
                  } catch (error) {
                    if (error instanceof Error) {
                      setError(error.message);
                    } else {
                      setError("구글 로그인을 시작할 수 없습니다.");
                    }
                  }
                }}
                className="rounded-2xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              >
                구글
              </button>
            </div>

            <div className="mt-8 rounded-2xl bg-[#FFF9E8]/80 px-5 py-4 text-sm text-gray-600">
              <p>
                아직 회원이 아니신가요?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-green-600 underline-offset-4 hover:underline"
                >
                  회원가입
                </Link>
                으로 간편하게 시작해 보세요.
              </p>
            </div>
          </section>
        </div>
      </main>
    </AuthCitrusShell>
  );
}
