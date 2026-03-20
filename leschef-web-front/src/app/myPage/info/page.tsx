"use client";

// 동적 렌더링 강제 (useSearchParams 이슈 방지)
export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import useSWR from "swr";
import {
  fetchUserInfo,
  type UserInfoResponse,
  unlinkSocial,
  changePassword,
} from "@/utils/api/auth";
import { getKakaoLoginUrl, getGoogleLoginUrl, getNaverLoginUrl } from "@/config/apiConfig";
import DeleteAccount from "@/components/myPage/DeleteAccount";

function InfoPageContent() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdSubmitting, setPwdSubmitting] = useState(false);
  const [nickname, setNickname] = useState("user");

  const openPasswordModal = () => {
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    setShowPwdModal(true);
  };

  const handlePasswordChange = async () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    if (newPwd !== confirmPwd) {
      alert("새 비밀번호와 확인이 일치하지 않습니다.");
      return;
    }
    if (newPwd.length < 8) {
      alert("새 비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }
    setPwdSubmitting(true);
    try {
      await changePassword({ currentPwd, newPwd });
      alert("비밀번호가 변경되었습니다.");
      setShowPwdModal(false);
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (e) {
      alert(e instanceof Error ? e.message : "비밀번호 변경에 실패했습니다.");
    } finally {
      setPwdSubmitting(false);
    }
  };

  // 사용자 정보 가져오기 - SWR 캐싱 적용
  const {
    data: userInfo,
    error,
    isLoading: loading,
  } = useSWR<UserInfoResponse>(
    "/user-info",
    async () => {
      const data = await fetchUserInfo();
      if (!data?.text) {
        throw new Error("로그인이 필요합니다.");
      }
      return data;
    },
    {
      revalidateOnFocus: false, // 포커스 시 재검증 안 함 (사용자 정보는 거의 변하지 않음)
      dedupingInterval: 1800000, // 30분 동안 중복 요청 방지 (전역 설정보다 더 길게)
    }
  );

  useEffect(() => {
    if (userInfo?.nickName) {
      setNickname(userInfo.nickName);
    }
  }, [userInfo]);

  return (
    <div className="grid gap-6 md:grid-cols-[320px,1fr]">
      {loading && (
        <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white px-4 py-6 text-sm text-gray-500">
          정보를 불러오는 중입니다...
        </div>
      )}
      {error && !loading && (
        <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
          {error}
        </div>
      )}
      <section className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
        {/* 프로필 헤더 - 모바일: 세로 배치, 데스크톱: 좌우 배치 + 오른쪽에 아이콘 버튼 */}
        <div className="relative overflow-hidden rounded-[24px] border border-gray-200 bg-gradient-to-br from-orange-100 via-rose-100 to-yellow-100 px-6 py-8 lg:px-8 lg:py-10">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            {/* 프로필 정보 영역 */}
            <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:gap-6 lg:flex-1">
              <div className="flex h-20 w-20 lg:h-24 lg:w-24 items-center justify-center rounded-2xl bg-white/70 flex-shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  className="h-10 w-10 lg:h-12 lg:w-12 text-gray-500"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c1.5-3 4.5-5 8-5s6.5 2 8 5" />
                </svg>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xs uppercase tracking-[0.4em] text-gray-600 lg:text-sm">
                  Profile
                </p>
                <p className="text-2xl lg:text-3xl font-semibold text-gray-900 mt-1">{nickname}</p>
                <p className="text-sm lg:text-base text-gray-700 mt-1">나의 LesChef 요리 여정</p>
              </div>
            </div>

            {/* 데스크톱: 아이콘 버튼들 (오른쪽 배치) */}
            <div className="hidden lg:flex items-center gap-3 relative z-10">
              {/* 정보확인 */}
              <button
                className="flex flex-col items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-600 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md"
                title="정보확인"
                aria-label="정보확인"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5 mb-1"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span className="text-xs font-medium">정보확인</span>
              </button>

              {/* 정보변경 */}
              <button
                className="flex flex-col items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-600 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md"
                title="정보변경"
                aria-label="정보변경"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5 mb-1"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <span className="text-xs font-medium">정보변경</span>
              </button>

              {/* 비밀번호 변경 */}
              <button
                type="button"
                onClick={openPasswordModal}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-600 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md"
                title="비밀번호 변경"
                aria-label="비밀번호 변경"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5 mb-1"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span className="text-xs font-medium">비밀번호 변경</span>
              </button>

              {/* 회원 탈퇴 */}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-red-200 bg-white px-4 py-3 text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 hover:shadow-md"
                title="회원 탈퇴"
                aria-label="회원 탈퇴"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5 mb-1"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="18" y1="6" x2="22" y2="10" strokeWidth="2.5" />
                  <line x1="22" y1="6" x2="18" y2="10" strokeWidth="2.5" />
                </svg>
                <span className="text-xs font-medium">회원 탈퇴</span>
              </button>
            </div>
          </div>
        </div>

        {/* 모바일: 버튼 영역 (세로 배치) */}
        <div className="mt-6 space-y-3 lg:hidden">
          {["정보확인", "정보변경"].map((label) => (
            <button
              key={label}
              type="button"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-black"
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={openPasswordModal}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-black"
          >
            비밀번호 변경
          </button>

          {/* 회원 탈퇴 버튼 */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full rounded-2xl border border-red-200 px-4 py-3 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50"
          >
            회원 탈퇴
          </button>
        </div>
      </section>

      <section className="space-y-6">
        {/* SNS 계정 연동 섹션 */}
        <div className="rounded-[32px] border border-gray-200 bg-white px-6 py-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Account Link</p>
              <h2 className="text-2xl font-semibold text-gray-900">SNS 계정 연동</h2>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            네이버, 구글, 카카오 계정을 연동해 두면 다음부터는 해당 SNS 버튼으로 바로 로그인할 수
            있어요.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => {
                if (userInfo?.kakaoLinked) {
                  if (confirm("카카오 계정 연동을 해제하시겠습니까?")) {
                    unlinkSocial("kakao")
                      .then(() => window.location.reload())
                      .catch((err) => console.error(err));
                  }
                } else {
                  try {
                    const url = getKakaoLoginUrl("link");
                    window.location.href = url;
                  } catch (error) {
                    console.error(error);
                  }
                }
              }}
              className={`w-full rounded-2xl px-4 py-3 text-sm font-medium transition ${
                userInfo?.kakaoLinked
                  ? "border border-green-200 bg-green-50 text-green-700"
                  : "border border-gray-200 text-gray-700 hover:border-gray-400 hover:text-black"
              }`}
            >
              {userInfo?.kakaoLinked ? "카카오 연동 해제" : "카카오 계정 연동"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (userInfo?.googleLinked) {
                  if (confirm("구글 계정 연동을 해제하시겠습니까?")) {
                    unlinkSocial("google")
                      .then(() => window.location.reload())
                      .catch((err) => console.error(err));
                  }
                } else {
                  try {
                    const url = getGoogleLoginUrl("link");
                    window.location.href = url;
                  } catch (error) {
                    console.error(error);
                  }
                }
              }}
              className={`w-full rounded-2xl px-4 py-3 text-sm font-medium transition ${
                userInfo?.googleLinked
                  ? "border border-green-200 bg-green-50 text-green-700"
                  : "border border-gray-200 text-gray-700 hover:border-gray-400 hover:text-black"
              }`}
            >
              {userInfo?.googleLinked ? "구글 연동 해제" : "구글 계정 연동"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (userInfo?.naverLinked) {
                  if (confirm("네이버 계정 연동을 해제하시겠습니까?")) {
                    unlinkSocial("naver")
                      .then(() => window.location.reload())
                      .catch((err) => console.error(err));
                  }
                } else {
                  try {
                    const url = getNaverLoginUrl("link");
                    window.location.href = url;
                  } catch (error) {
                    console.error(error);
                  }
                }
              }}
              className={`w-full rounded-2xl px-4 py-3 text-sm font-medium transition ${
                userInfo?.naverLinked
                  ? "border border-green-200 bg-green-50 text-green-700"
                  : "border border-gray-200 text-gray-700 hover:border-gray-400 hover:text-black"
              }`}
            >
              {userInfo?.naverLinked ? "네이버 연동 해제" : "네이버 계정 연동"}
            </button>
          </div>
        </div>

        <div className="rounded-[32px] border border-gray-200 bg-white px-6 py-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Inventory Alert</p>
              <h2 className="text-2xl font-semibold text-gray-900">기한 임박 물품</h2>
            </div>
            <span className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500">
              0 items
            </span>
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-12 text-center text-sm text-gray-400">
            아직 임박한 재료가 없어요. 재료를 추가하면 여기에서 바로 확인할 수 있어요.
          </div>
        </div>

        <div className="rounded-[32px] border border-gray-200 bg-white px-6 py-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">My Recipes</p>
              <h2 className="text-2xl font-semibold text-gray-900">나의 인기 레시피</h2>
            </div>
            <span className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500">
              준비 중
            </span>
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-12 text-center text-sm text-gray-400">
            레시피를 저장하거나 좋아요하면 이곳에 summary가 표시됩니다.
          </div>
        </div>
      </section>

      {/* 비밀번호 변경 모달 */}
      {showPwdModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwd-modal-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <h3 id="pwd-modal-title" className="text-lg font-semibold text-gray-900">
              비밀번호 변경
            </h3>
            <p className="mt-1 text-xs text-gray-500">8자 이상, 영문과 숫자를 포함해야 합니다.</p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  현재 비밀번호
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">새 비밀번호</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  새 비밀번호 확인
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPwdModal(false)}
                disabled={pwdSubmitting}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => void handlePasswordChange()}
                disabled={pwdSubmitting}
                className="rounded-xl bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50"
              >
                {pwdSubmitting ? "처리 중…" : "변경"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 회원 탈퇴 확인 모달 */}
      <DeleteAccount isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} />
    </div>
  );
}

export default function InfoPage() {
  return (
    <Suspense
      fallback={
        <div className="grid gap-6 md:grid-cols-[320px,1fr]">
          <div className="md:col-span-2 flex items-center justify-center min-h-[400px]">
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <InfoPageContent />
    </Suspense>
  );
}
