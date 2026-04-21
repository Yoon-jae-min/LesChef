"use client";

// 동적 렌더링 강제 (useSearchParams 이슈 방지)
export const dynamic = "force-dynamic";

import Link from "next/link";
import Top from "@/components/common/navigation/Top";
import { useState, useEffect } from "react";
import { signup, checkIdDuplicate, sendVerificationCode, verifyEmailCode } from "@/utils/api/auth";
import { STORAGE_KEYS } from "@/constants/storage/storageKeys";
import { getKakaoLoginUrl, getGoogleLoginUrl, getNaverLoginUrl } from "@/config/apiConfig";

const LOGIN_ID_REGEX = /^[a-zA-Z0-9]{3,50}$/;

export default function SignupPage() {
  const [loginId, setLoginId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [returnTo, setReturnTo] = useState<string>("/");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 이메일 인증 관련 상태
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const [availableIdTrim, setAvailableIdTrim] = useState<string | null>(null);
  const [idAvailabilityNote, setIdAvailabilityNote] = useState<string | null>(null);
  const [isIdChecking, setIsIdChecking] = useState(false);

  // URL 파라미터에서 return 경로 가져오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const backParam = params.get("back");
      const storedReturn = sessionStorage.getItem(STORAGE_KEYS.RETURN_TO);
      setReturnTo(backParam || storedReturn || "/");
    }
  }, []);

  // 타이머 카운트다운
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 이메일 인증 코드 발송
  const handleSendVerificationCode = async () => {
    if (!email) {
      setVerificationError("이메일을 입력해주세요.");
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setVerificationError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    setIsSendingCode(true);
    setVerificationError(null);
    setIsEmailVerified(false);
    setVerificationCode("");

    try {
      await sendVerificationCode(email);
      setCountdown(600); // 10분 (600초)
      alert("인증 코드가 발송되었습니다. 이메일을 확인해주세요.");
    } catch (error) {
      setVerificationError(
        error instanceof Error ? error.message : "인증 코드 발송에 실패했습니다."
      );
    } finally {
      setIsSendingCode(false);
    }
  };

  // 이메일 인증 코드 검증
  const handleVerifyCode = async () => {
    if (!email || !verificationCode) {
      setVerificationError("인증 코드를 입력해주세요.");
      return;
    }

    setIsVerifyingCode(true);
    setVerificationError(null);

    try {
      await verifyEmailCode(email, verificationCode);
      setIsEmailVerified(true);
      setCountdown(0);
      alert("이메일 인증이 완료되었습니다.");
    } catch (error) {
      setVerificationError(
        error instanceof Error ? error.message : "인증 코드가 올바르지 않습니다."
      );
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // 회원가입 제출 함수
  const handleSignup = async () => {
    setError(null);

    // 이메일 인증 확인 (로컬 npm run dev 포함 동일)
    if (!isEmailVerified) {
      setError("이메일 인증을 완료해주세요.");
      return;
    }

    const idTrim = loginId.trim();
    if (!idTrim || !LOGIN_ID_REGEX.test(idTrim)) {
      const idRuleMsg = "아이디는 3~50자이며, 영문과 숫자만 사용할 수 있습니다.";
      alert(idRuleMsg);
      setError(idRuleMsg);
      return;
    }

    if (availableIdTrim !== idTrim) {
      setError("아이디 중복 확인을 완료해주세요.");
      return;
    }

    const emailTrim = email.trim();
    const signupEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!signupEmailRegex.test(emailTrim)) {
      setError("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    // 유효성 검사
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    if (!agreeToTerms) {
      setError("이용약관에 동의해주세요.");
      return;
    }

    try {
      const response = await signup({
        id: idTrim,
        email: emailTrim,
        pwd: password,
        nickName: nickname,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.message === "ok") {
          // 회원가입 성공 시 처리
          if (typeof window !== "undefined") {
            sessionStorage.removeItem(STORAGE_KEYS.RETURN_TO);
            alert("회원가입이 완료되었습니다!");
            window.location.href = returnTo;
          }
        } else {
          throw new Error("서버 응답 오류");
        }
      } else {
        const errorText = await response.text();
        throw new Error(errorText || `회원가입 실패: ${response.status}`);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("회원가입 실패:", error);
      }
      setError(
        error instanceof Error ? error.message : "회원가입에 실패했습니다. 다시 시도해주세요."
      );
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleSignup();
  };

  const handleCheckIdDuplicate = async () => {
    const idTrim = loginId.trim();
    setError(null);
    if (!idTrim || !LOGIN_ID_REGEX.test(idTrim)) {
      setAvailableIdTrim(null);
      setIdAvailabilityNote("영문·숫자 3~50자 형식으로 입력한 뒤 중복 확인을 해주세요.");
      return;
    }

    setIsIdChecking(true);
    setIdAvailabilityNote(null);
    try {
      const raw = (await checkIdDuplicate(idTrim)).trim();
      if (raw === "중복") {
        setAvailableIdTrim(null);
        setIdAvailabilityNote("이미 사용 중인 아이디입니다.");
      } else if (raw === "중복 아님") {
        setAvailableIdTrim(idTrim);
        setIdAvailabilityNote("사용 가능한 아이디입니다.");
      } else {
        setAvailableIdTrim(null);
        setIdAvailabilityNote("응답을 확인할 수 없습니다. 다시 시도해주세요.");
      }
    } catch (e) {
      setAvailableIdTrim(null);
      setIdAvailabilityNote(e instanceof Error ? e.message : "중복 확인에 실패했습니다.");
    } finally {
      setIsIdChecking(false);
    }
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
              Join us
            </p>
            <h1 className="mt-4 text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight">
              새로운 요리 여정,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-400 to-yellow-400">
                LesChef{" "}
              </span>
              와 <span className="underline decoration-4 decoration-orange-300">시작</span>
            </h1>

            <p className="mt-6 text-base text-gray-600 leading-relaxed">
              냉장고 재료 관리부터 맞춤 레시피 추천까지. 지금 가입하고 나만의 요리 여정을
              시작해보세요.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "냉장고 재료 기반 레시피 추천",
                "커뮤니티에서 레시피 공유",
                "즐겨찾기와 보관함 관리",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-gray-800">
                  <span className="mt-1 h-2 w-2 rounded-full bg-black" />
                  <p className="text-sm lg:text-base leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 회원가입 폼 */}
          <section className="bg-white border border-gray-200 rounded-[32px] px-8 py-10 lg:px-12 lg:py-12 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-gray-900">회원가입</h2>
              <p className="text-sm text-gray-500">LesChef와 함께 요리 여정을 시작해보세요.</p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">아이디 (로그인용)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={loginId}
                    onChange={(e) => {
                      setLoginId(e.target.value.slice(0, 50));
                      setAvailableIdTrim(null);
                      setIdAvailabilityNote(null);
                    }}
                    placeholder="영문,숫자(3~50자)"
                    className="min-w-0 flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-600 focus:border-gray-400 focus:ring-0"
                    required
                    maxLength={50}
                    autoComplete="username"
                  />
                  <button
                    type="button"
                    onClick={handleCheckIdDuplicate}
                    disabled={isIdChecking}
                    className="shrink-0 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-800 hover:border-gray-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap"
                  >
                    {isIdChecking ? "확인 중…" : "중복 확인"}
                  </button>
                </div>
                {idAvailabilityNote && (
                  <p
                    className={`text-xs ${
                      availableIdTrim === loginId.trim()
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {idAvailabilityNote}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">이메일 (인증·연락용) · 필수</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIsEmailVerified(false);
                      setVerificationCode("");
                      setVerificationError(null);
                    }}
                    placeholder="you@example.com"
                    className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-600 focus:border-gray-400 focus:ring-0 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                    disabled={isEmailVerified}
                  />
                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    disabled={isSendingCode || countdown > 0 || isEmailVerified}
                    className="px-4 py-3 rounded-2xl bg-gray-800 text-white text-sm font-medium hover:bg-gray-900 transition disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isSendingCode
                      ? "발송 중..."
                      : countdown > 0
                        ? `${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, "0")}`
                        : isEmailVerified
                          ? "인증 완료"
                          : "인증 코드 발송"}
                  </button>
                </div>
                {isEmailVerified && (
                  <p className="text-xs text-green-600">✓ 이메일 인증이 완료되었습니다.</p>
                )}
                <p className="text-xs text-gray-500">
                  인증 코드로 본인 이메일을 확인합니다. (실제로 메일을 받을 수 있는 주소)
                </p>
              </div>

              {/* 인증 코드 입력 */}
              {!isEmailVerified && countdown > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">인증 코드</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => {
                        setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                        setVerificationError(null);
                      }}
                      placeholder="6자리 인증 코드"
                      className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-600 focus:border-gray-400 focus:ring-0"
                      maxLength={6}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyCode}
                      disabled={isVerifyingCode || verificationCode.length !== 6}
                      className="px-4 py-3 rounded-2xl bg-black text-white text-sm font-medium hover:bg-gray-900 transition disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isVerifyingCode ? "확인 중..." : "인증 확인"}
                    </button>
                  </div>
                  {verificationError && <p className="text-xs text-red-500">{verificationError}</p>}
                  {countdown > 0 && (
                    <p className="text-xs text-gray-500">
                      인증 코드가 만료되기 전까지 {Math.floor(countdown / 60)}분 {countdown % 60}초
                      남았습니다.
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">닉네임</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임을 입력해주세요"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-600 focus:border-gray-400 focus:ring-0"
                  required
                  autoComplete="nickname"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">비밀번호</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력해주세요 (최소 8자)"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 pr-12 text-sm text-gray-900 placeholder:text-gray-600 focus:border-gray-400 focus:ring-0"
                    required
                    minLength={8}
                    autoComplete="new-password"
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">비밀번호 확인</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="비밀번호를 다시 입력해주세요"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 pr-12 text-sm text-gray-900 placeholder:text-gray-600 focus:border-gray-400 focus:ring-0"
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-xs text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? "숨기기" : "보기"}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="inline-flex items-start gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                    required
                  />
                  <span>
                    <Link href="/terms" className="text-black underline-offset-4 hover:underline">
                      이용약관
                    </Link>
                    및{" "}
                    <Link href="/privacy" className="text-black underline-offset-4 hover:underline">
                      개인정보처리방침
                    </Link>
                    에 동의합니다.
                  </span>
                </label>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                className="w-full rounded-2xl bg-black py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                회원가입하기
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
                    alert("카카오 로그인을 시작할 수 없습니다.");
                  }
                }}
                className="rounded-2xl border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:border-gray-400 hover:text-black transition"
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
                    alert("네이버 로그인을 시작할 수 없습니다.");
                  }
                }}
                className="rounded-2xl border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:border-gray-400 hover:text-black transition"
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
                    alert("구글 로그인을 시작할 수 없습니다.");
                  }
                }}
                className="rounded-2xl border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:border-gray-400 hover:text-black transition"
              >
                구글
              </button>
            </div>

            <div className="mt-8 rounded-2xl bg-gray-50 px-5 py-4 text-sm text-gray-600">
              <p>
                이미 회원이신가요?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-black underline-offset-4 hover:underline"
                >
                  로그인
                </Link>
                하러 가기
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
