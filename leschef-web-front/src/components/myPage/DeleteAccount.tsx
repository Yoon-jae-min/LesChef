"use client";

import { useState } from "react";

interface DeleteAccountProps {
  isOpen: boolean;
  onClose: () => void;
}

type DeleteStep = "warning" | "password" | "reason" | "final";

const DELETE_REASONS = [
  "서비스 이용이 불편함",
  "원하는 기능이 없음",
  "다른 서비스 이용",
  "개인정보 보호 우려",
  "기타",
] as const;

export default function DeleteAccount({ isOpen, onClose }: DeleteAccountProps) {
  const [deleteStep, setDeleteStep] = useState<DeleteStep>("warning");
  const [password, setPassword] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordCheck = () => {
    setPasswordError("");

    // 비밀번호 확인 엔드포인트 연결 필요
    // 성공 시:
    setDeleteStep("reason");
  };

  const handleReasonSubmit = () => {
    if (!deleteReason) {
      return;
    }
    setDeleteStep("final");
  };

  const handleDeleteAccount = () => {
    // 실제 서버로 탈퇴 요청 (/customer/delete) 필요
    alert("회원 탈퇴 API 연동 후 처리됩니다.");
    // API 연동 후 성공 시:
    // onClose();
  };

  const handleClose = () => {
    setDeleteStep("warning");
    setPassword("");
    setDeleteReason("");
    setCustomReason("");
    setPasswordError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[32px] border border-gray-200 p-8 max-w-md w-full shadow-[6px_6px_0_rgba(0,0,0,0.05)] max-h-[90vh] overflow-y-auto">
        {/* 1단계: 경고 */}
        {deleteStep === "warning" && (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2 text-center">회원 탈퇴</h3>
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
                onClick={handleClose}
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
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">비밀번호 확인</h3>
            <p className="text-sm text-gray-600 mb-6">보안을 위해 비밀번호를 입력해주세요.</p>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
                  onKeyPress={(e) => e.key === "Enter" && handlePasswordCheck()}
                />
                {passwordError && <p className="text-sm text-red-500 mt-2">{passwordError}</p>}
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
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">탈퇴 사유</h3>
            <p className="text-sm text-gray-600 mb-6">
              서비스 개선을 위해 탈퇴 사유를 알려주세요. (선택사항)
            </p>
            <div className="space-y-3 mb-6">
              {DELETE_REASONS.map((reason) => (
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
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2 text-center">최종 확인</h3>
              <p className="text-sm text-gray-600 mb-4 text-center">정말로 탈퇴하시겠습니까?</p>
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
  );
}
