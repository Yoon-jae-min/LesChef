"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InfoPage() {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteStep, setDeleteStep] = useState<"warning" | "password" | "reason" | "final">("warning");
  const [password, setPassword] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nickname, setNickname] = useState("user");

  useEffect(() => {
    // localStorage에서 현재 사용자 정보 가져오기
    if (typeof window !== "undefined") {
      const currentUser = JSON.parse(localStorage.getItem("leschef_current_user") || "{}");
      if (currentUser.nickname) {
        setNickname(currentUser.nickname);
      }
    }
  }, []);

  const handlePasswordCheck = () => {
    setPasswordError("");
    
    // TODO: API 연동 - 실제 서버로 비밀번호 확인
    // const response = await fetch("/api/user/verify-password", {
    //   method: "POST",
    //   body: JSON.stringify({ password }),
    // });
    
    // Mock: localStorage에서 비밀번호 확인
    const currentUser = JSON.parse(localStorage.getItem("leschef_current_user") || "{}");
    const users = JSON.parse(localStorage.getItem("leschef_mock_users") || "[]");
    const user = users.find((u: any) => u.id === currentUser.id);
    
    if (!user || user.password !== password) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }
    
    setDeleteStep("reason");
  };

  const handleReasonSubmit = () => {
    if (!deleteReason) {
      return;
    }
    setDeleteStep("final");
  };

  const handleDeleteAccount = () => {
    // TODO: API 연동 - 실제 서버로 탈퇴 요청
    // const response = await fetch("/api/user/delete", {
    //   method: "DELETE",
    //   headers: { "Authorization": `Bearer ${token}` },
    // });
    
    // Mock: localStorage에서 사용자 정보 삭제
    const currentUser = JSON.parse(localStorage.getItem("leschef_current_user") || "{}");
    const users = JSON.parse(localStorage.getItem("leschef_mock_users") || "[]");
    
    // 사용자 목록에서 제거
    const updatedUsers = users.filter((user: any) => user.id !== currentUser.id);
    localStorage.setItem("leschef_mock_users", JSON.stringify(updatedUsers));
    
    // 로그인 상태 및 사용자 정보 삭제
    localStorage.removeItem("leschef_is_logged_in");
    localStorage.removeItem("leschef_current_user");
    
    alert("회원 탈퇴가 완료되었습니다.");
    // 상태 초기화
    setShowDeleteConfirm(false);
    setDeleteStep("warning");
    setPassword("");
    setDeleteReason("");
    setCustomReason("");
    router.push("/");
  };

  const handleCloseModal = () => {
    setShowDeleteConfirm(false);
    setDeleteStep("warning");
    setPassword("");
    setDeleteReason("");
    setCustomReason("");
    setPasswordError("");
  };

  const deleteReasons = [
    "서비스 이용이 불편함",
    "원하는 기능이 없음",
    "다른 서비스 이용",
    "개인정보 보호 우려",
    "기타",
  ];

  return (
    <div className="grid gap-6 md:grid-cols-[320px,1fr]">
      <section className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
        <div className="relative overflow-hidden rounded-[24px] border border-gray-200 bg-gradient-to-br from-orange-100 via-rose-100 to-yellow-100 px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/70">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="h-10 w-10 text-gray-500">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c1.5-3 4.5-5 8-5s6.5 2 8 5" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-600">Profile</p>
              <p className="text-2xl font-semibold text-gray-900">{nickname}</p>
              <p className="text-sm text-gray-700">나의 LesChef 요리 여정</p>
            </div>
          </div>
          <div className="absolute inset-0 rounded-[24px] border border-gray-200/10" />
        </div>

        <div className="mt-6 space-y-3">
          {["정보확인", "정보변경", "비밀번호 변경"].map((label) => (
            <button
              key={label}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-black"
            >
              {label}
            </button>
          ))}
          
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

      {/* 회원 탈퇴 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] border border-gray-200 p-8 max-w-md w-full shadow-[6px_6px_0_rgba(0,0,0,0.05)] max-h-[90vh] overflow-y-auto">
            {/* 1단계: 경고 */}
            {deleteStep === "warning" && (
              <>
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
                    회원 탈퇴
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    정말로 회원 탈퇴를 하시겠습니까?
                  </p>
                  <div className="rounded-2xl bg-red-50 border border-red-200 p-4 mb-4">
                    <p className="text-sm text-red-800 font-medium mb-2">탈퇴 시 삭제되는 정보:</p>
                    <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
                      <li>계정 정보 및 프로필</li>
                      <li>작성한 레시피 및 게시글</li>
                      <li>보관함 재료 정보</li>
                      <li>즐겨찾기 및 저장된 레시피</li>
                    </ul>
                    <p className="text-xs text-red-800 font-medium mt-3">
                      ⚠️ 모든 데이터는 복구할 수 없습니다.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => setDeleteStep("password")}
                    className="flex-1 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 hover:border-red-300 hover:bg-red-100 transition"
                  >
                    계속하기
                  </button>
                </div>
              </>
            )}

            {/* 2단계: 비밀번호 확인 */}
            {deleteStep === "password" && (
              <>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  비밀번호 확인
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  보안을 위해 비밀번호를 입력해주세요.
                </p>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      비밀번호
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError("");
                      }}
                      placeholder="비밀번호를 입력하세요"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
                      onKeyPress={(e) => e.key === 'Enter' && handlePasswordCheck()}
                    />
                    {passwordError && (
                      <p className="text-sm text-red-500 mt-2">{passwordError}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteStep("warning")}
                    className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
                  >
                    이전
                  </button>
                  <button
                    onClick={handlePasswordCheck}
                    className="flex-1 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 hover:border-red-300 hover:bg-red-100 transition"
                  >
                    확인
                  </button>
                </div>
              </>
            )}

            {/* 3단계: 탈퇴 사유 */}
            {deleteStep === "reason" && (
              <>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  탈퇴 사유
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  서비스 개선을 위해 탈퇴 사유를 알려주세요. (선택사항)
                </p>
                <div className="space-y-3 mb-6">
                  {deleteReasons.map((reason) => (
                    <label
                      key={reason}
                      className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 hover:border-gray-300 cursor-pointer transition"
                    >
                      <input
                        type="radio"
                        name="deleteReason"
                        value={reason}
                        checked={deleteReason === reason}
                        onChange={(e) => {
                          setDeleteReason(e.target.value);
                          if (e.target.value !== "기타") {
                            setCustomReason("");
                          }
                        }}
                        className="h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">{reason}</span>
                    </label>
                  ))}
                  {deleteReason === "기타" && (
                    <textarea
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="탈퇴 사유를 입력해주세요"
                      rows={3}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0 resize-none"
                    />
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteStep("password")}
                    className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
                  >
                    이전
                  </button>
                  <button
                    onClick={handleReasonSubmit}
                    disabled={!deleteReason}
                    className="flex-1 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 hover:border-red-300 hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    다음
                  </button>
                </div>
              </>
            )}

            {/* 4단계: 최종 확인 */}
            {deleteStep === "final" && (
              <>
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
                    최종 확인
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    정말로 탈퇴하시겠습니까?
                  </p>
                  <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
                    <p className="text-xs text-gray-600 mb-2">선택하신 탈퇴 사유:</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {deleteReason}
                      {deleteReason === "기타" && customReason && ` - ${customReason}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteStep("reason")}
                    className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
                  >
                    이전
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 rounded-2xl border border-red-200 bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 transition"
                  >
                    탈퇴하기
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
