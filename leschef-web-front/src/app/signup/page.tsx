"use client";

import Link from "next/link";
import Top from "@/components/common/top";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    // 유효성 검사
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    if (!agreeToTerms) {
      setError("이용약관에 동의해주세요.");
      return;
    }

    // TODO: API 연동 - 실제 서버로 데이터 전송
    // const response = await fetch("/api/signup", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, password, nickname }),
    // });
    
    // Mock: localStorage에 사용자 정보 저장
    // 실제 서버에서는 이렇게 하지 않고, 서버의 데이터베이스에 저장해야 합니다
    const users = JSON.parse(localStorage.getItem("leschef_mock_users") || "[]");
    
    // 이메일 중복 체크
    if (users.find((user: any) => user.email === email)) {
      setError("이미 등록된 이메일입니다.");
      return;
    }
    
    // 새 사용자 추가
    const newUser = {
      id: Date.now().toString(), // 임시 ID
      email,
      password, // 실제로는 해시화된 비밀번호를 저장해야 함
      nickname,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem("leschef_mock_users", JSON.stringify(users));
    
    // 회원가입 성공 시 자동 로그인 처리
    localStorage.setItem("leschef_is_logged_in", "true");
    localStorage.setItem("leschef_current_user", JSON.stringify({
      id: newUser.id,
      email: newUser.email,
      nickname: newUser.nickname,
    }));
    
    console.log("회원가입 완료 (Mock):", newUser);
    console.log("저장된 모든 사용자:", users);
    
    // 회원가입 후 리다이렉트
    const returnTo = searchParams.get("back") || sessionStorage.getItem("leschef_return_to") || "/";
    sessionStorage.removeItem("leschef_return_to");
    
    alert("회원가입이 완료되었습니다!");
    router.push(returnTo);
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
              와{" "}
              <span className="underline decoration-4 decoration-orange-300">
                시작
              </span>
            </h1>

            <p className="mt-6 text-base text-gray-600 leading-relaxed">
              냉장고 재료 관리부터 맞춤 레시피 추천까지. 지금 가입하고
              나만의 요리 여정을 시작해보세요.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "냉장고 재료 기반 레시피 추천",
                "커뮤니티에서 레시피 공유",
                "즐겨찾기와 보관함 관리",
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

          {/* 회원가입 폼 */}
          <section className="bg-white border border-gray-200 rounded-[32px] px-8 py-10 lg:px-12 lg:py-12 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-gray-900">
                회원가입
              </h2>
              <p className="text-sm text-gray-500">
                LesChef와 함께 요리 여정을 시작해보세요.
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
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  닉네임
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임을 입력해주세요"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
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
                  placeholder="비밀번호를 입력해주세요 (최소 6자)"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력해주세요"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
                  required
                  minLength={6}
                />
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
                    <Link
                      href="/terms"
                      className="text-black underline-offset-4 hover:underline"
                    >
                      이용약관
                    </Link>
                    및{" "}
                    <Link
                      href="/privacy"
                      className="text-black underline-offset-4 hover:underline"
                    >
                      개인정보처리방침
                    </Link>
                    에 동의합니다.
                  </span>
                </label>
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

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

