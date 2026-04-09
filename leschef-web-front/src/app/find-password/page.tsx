"use client";

import Link from "next/link";
import Top from "@/components/common/navigation/Top";
import { useState, Suspense } from "react";
import { completePasswordReset, verifyPasswordReset } from "@/utils/api/auth";

function validateNewPassword(pwd: string): string | null {
  if (pwd.length < 8) return "비밀번호는 최소 8자 이상이어야 합니다.";
  if (pwd.length > 128) return "비밀번호는 128자 이하여야 합니다.";
  if (!/[0-9]/.test(pwd)) return "비밀번호에 숫자를 포함해주세요.";
  if (!/[a-zA-Z]/.test(pwd)) return "비밀번호에 영문을 포함해주세요.";
  return null;
}

function FindPasswordPageContent() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [expiresHint, setExpiresHint] = useState<number | null>(null);

  const [newPwd, setNewPwd] = useState("");
  const [newPwd2, setNewPwd2] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [done, setDone] = useState(false);

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsBusy(true);
    try {
      const res = await verifyPasswordReset(email, name, phone);
      setResetToken(res.resetToken);
      setExpiresHint(res.expiresInMinutes);
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : "본인 확인에 실패했습니다.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!resetToken) {
      setError("세션이 만료되었습니다. 처음부터 다시 진행해주세요.");
      return;
    }

    const pwdErr = validateNewPassword(newPwd);
    if (pwdErr) {
      setError(pwdErr);
      return;
    }
    if (newPwd !== newPwd2) {
      setError("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    setIsBusy(true);
    try {
      await completePasswordReset(resetToken, newPwd);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "비밀번호 변경에 실패했습니다.");
    } finally {
      setIsBusy(false);
    }
  };

  const resetFlow = () => {
    setStep(1);
    setEmail("");
    setName("");
    setPhone("");
    setResetToken(null);
    setExpiresHint(null);
    setNewPwd("");
    setNewPwd2("");
    setError(null);
    setDone(false);
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
              Reset Password
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-gray-900 lg:text-5xl">
              비밀번호를
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-red-400 to-yellow-400 bg-clip-text text-transparent">
                재설정하세요
              </span>
            </h1>

            <p className="mt-6 text-base leading-relaxed text-gray-600">
              1단계: 가입 시 아이디(이메일)·이름·전화번호로 본인 확인
              <br />
              2단계: 새 비밀번호를 입력하면 즉시 반영됩니다.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "본인 정보 일치 시에만 다음 단계로 이동",
                "재설정은 제한 시간 내에만 가능",
                "비밀번호는 영문+숫자, 8자 이상",
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
              <h2 className="text-2xl font-semibold text-gray-900">비밀번호 찾기</h2>
              <p className="text-sm text-gray-500">
                {step === 1 ? "등록된 정보로 본인 확인" : "새 비밀번호를 입력하세요"}
              </p>
            </div>

            {done ? (
              <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-8 text-center">
                <p className="mb-2 text-lg font-semibold text-gray-900">비밀번호가 변경되었습니다</p>
                <p className="mb-6 text-sm text-gray-600">새 비밀번호로 로그인해주세요.</p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.location.href = "/login";
                      }
                    }}
                    className="flex-1 rounded-2xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    로그인하기
                  </button>
                  <button
                    type="button"
                    onClick={resetFlow}
                    className="flex-1 rounded-2xl border border-gray-200 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    처음으로
                  </button>
                </div>
              </div>
            ) : step === 1 ? (
              <form className="mt-8 space-y-6" onSubmit={handleVerify}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">아이디 (이메일)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-600 focus:border-gray-400 focus:ring-0"
                    required
                    autoComplete="email"
                  />
                </div>

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
                  disabled={isBusy}
                  className="w-full rounded-2xl bg-black py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isBusy ? "확인 중..." : "본인 확인"}
                </button>
              </form>
            ) : (
              <form className="mt-8 space-y-6" onSubmit={handleReset}>
                {expiresHint != null && (
                  <p className="rounded-2xl bg-amber-50 px-4 py-3 text-xs text-amber-900">
                    재설정 가능 시간: 약 {expiresHint}분. 시간이 지나면 다시 본인 확인이 필요합니다.
                  </p>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">새 비밀번호</label>
                  <input
                    type="password"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    placeholder="영문+숫자, 8자 이상"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-600 focus:border-gray-400 focus:ring-0"
                    required
                    autoComplete="new-password"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">새 비밀번호 확인</label>
                  <input
                    type="password"
                    value={newPwd2}
                    onChange={(e) => setNewPwd2(e.target.value)}
                    placeholder="한 번 더 입력"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-600 focus:border-gray-400 focus:ring-0"
                    required
                    autoComplete="new-password"
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={resetFlow}
                    className="flex-1 rounded-2xl border border-gray-200 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    이전 단계
                  </button>
                  <button
                    type="submit"
                    disabled={isBusy}
                    className="flex-1 rounded-2xl bg-black py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isBusy ? "변경 중..." : "비밀번호 변경"}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 flex items-center justify-center gap-4 text-sm">
              <Link href="/login" className="text-gray-600 transition hover:text-black">
                로그인
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/find-id" className="text-gray-600 transition hover:text-black">
                아이디 찾기
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

export default function FindPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
          <div className="flex min-h-screen items-center justify-center">
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <FindPasswordPageContent />
    </Suspense>
  );
}
