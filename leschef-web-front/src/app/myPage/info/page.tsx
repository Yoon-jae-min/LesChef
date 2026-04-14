"use client";

// 동적 렌더링 강제 (useSearchParams 이슈 방지)
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo, Suspense } from "react";
import useSWR from "swr";
import {
  fetchUserInfo,
  updateUserProfile,
  type UserInfoResponse,
  unlinkSocial,
  changePassword,
} from "@/utils/api/auth";
import { getKakaoLoginUrl, getGoogleLoginUrl, getNaverLoginUrl } from "@/config/apiConfig";
import DeleteAccount from "@/components/myPage/DeleteAccount";
import ExpiryAlerts from "@/components/storage/summary/ExpiryAlerts";
import { TIMING } from "@/constants/system/timing";
import { STORAGE_KEYS } from "@/constants/storage/storageKeys";
import {
  fetchExpiryAlerts,
  type ExpiryAlertResponse,
  type FoodItem,
} from "@/utils/api/foods";
import { fetchMyRecipeList } from "@/utils/api/recipeApi";
import type { RecipeListItem } from "@/types/recipe";

function syncStoredUserProfile(partial: { nickName?: string; tel?: string }) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    const cur = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    const next = { ...cur, ...partial };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

function InfoField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-stone-100 py-3 last:border-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-stone-500">
        {label}
      </span>
      <span className="min-w-0 break-all text-sm text-stone-900">{value || "—"}</span>
    </div>
  );
}

type AlertSeverity = "expired" | "urgent" | "warning" | "notice";

function flattenExpiryPreview(
  a: ExpiryAlertResponse
): Array<{ place: string; food: FoodItem; severity: AlertSeverity }> {
  const rows: Array<{ place: string; food: FoodItem; severity: AlertSeverity }> = [];
  for (const x of a.expired) rows.push({ ...x, severity: "expired" });
  for (const x of a.urgent) rows.push({ ...x, severity: "urgent" });
  for (const x of a.warning) rows.push({ ...x, severity: "warning" });
  for (const x of a.notice) rows.push({ ...x, severity: "notice" });
  const rank: Record<AlertSeverity, number> = { expired: 0, urgent: 1, warning: 2, notice: 3 };
  rows.sort((A, B) => {
    const dr = rank[A.severity] - rank[B.severity];
    if (dr !== 0) return dr;
    const da = typeof A.food.daysUntilExpiry === "number" ? A.food.daysUntilExpiry : 9999;
    const db = typeof B.food.daysUntilExpiry === "number" ? B.food.daysUntilExpiry : 9999;
    return da - db;
  });
  return rows;
}

function formatExpiryHint(food: FoodItem): string {
  const d = food.daysUntilExpiry;
  if (typeof d === "number") {
    if (d < 0) return `만료 ${Math.abs(d)}일`;
    if (d === 0) return "오늘 만료";
    return `D-${d}`;
  }
  if (food.expirate) {
    const dt = typeof food.expirate === "string" ? new Date(food.expirate) : food.expirate;
    if (!Number.isNaN(dt.getTime())) return dt.toLocaleDateString("ko-KR");
  }
  return "유통기한";
}

function severityLabel(s: AlertSeverity): string {
  switch (s) {
    case "expired":
      return "만료";
    case "urgent":
      return "긴급";
    case "warning":
      return "경고";
    case "notice":
      return "알림";
  }
}

function severityDotClass(s: AlertSeverity): string {
  switch (s) {
    case "expired":
      return "bg-red-500";
    case "urgent":
      return "bg-orange-500";
    case "warning":
      return "bg-yellow-500";
    case "notice":
      return "bg-blue-500";
  }
}

const EXPIRY_PREVIEW_LIMIT = 8;

/** 백엔드 `POPULARITY_WEIGHTS`와 동일 — 나의 레시피 중 인기 순 정렬용 */
const MY_RECIPE_POPULARITY_WEIGHTS = {
  VIEW_COUNT: 0.3,
  RATING: 30,
  REVIEW_COUNT: 2,
} as const;

const MY_RECIPE_TOP_N = 5;

function myRecipePopularityScore(item: RecipeListItem): number {
  const v = item.viewCount ?? 0;
  const r = item.averageRating ?? 0;
  const rc = item.reviewCount ?? 0;
  return (
    v * MY_RECIPE_POPULARITY_WEIGHTS.VIEW_COUNT +
    r * MY_RECIPE_POPULARITY_WEIGHTS.RATING +
    rc * MY_RECIPE_POPULARITY_WEIGHTS.REVIEW_COUNT
  );
}

function pickPopularMyRecipes(list: RecipeListItem[], n: number): RecipeListItem[] {
  const withId = list.filter((x) => Boolean(x._id));
  const sorted = [...withId].sort((a, b) => {
    const diff = myRecipePopularityScore(b) - myRecipePopularityScore(a);
    if (diff !== 0) return diff;
    return (b.viewCount ?? 0) - (a.viewCount ?? 0);
  });
  return sorted.slice(0, n);
}

function InfoPageContent() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNickName, setEditNickName] = useState("");
  const [editTel, setEditTel] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
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
    mutate: revalidateUserInfo,
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

  const {
    data: expiryAlerts,
    error: expiryError,
    isLoading: expiryLoading,
  } = useSWR("/foods/expiry-alerts", () => fetchExpiryAlerts("all"), {
    revalidateOnFocus: false,
    dedupingInterval: TIMING.FIVE_MINUTES,
  });

  const alertTotal = useMemo(() => {
    if (!expiryAlerts) return 0;
    if (typeof expiryAlerts.totalCount === "number") return expiryAlerts.totalCount;
    return (
      expiryAlerts.expiredCount +
      expiryAlerts.urgentCount +
      expiryAlerts.warningCount +
      expiryAlerts.noticeCount
    );
  }, [expiryAlerts]);

  const expiryPreview = useMemo(
    () => (expiryAlerts ? flattenExpiryPreview(expiryAlerts).slice(0, EXPIRY_PREVIEW_LIMIT) : []),
    [expiryAlerts]
  );

  const {
    data: myRecipesData,
    error: myRecipesError,
    isLoading: myRecipesLoading,
  } = useSWR("/my-recipes", fetchMyRecipeList, {
    revalidateOnFocus: false,
    dedupingInterval: TIMING.FIVE_MINUTES,
  });

  const myRecipeList = myRecipesData?.list ?? [];
  const myRecipeTotal = myRecipeList.length;
  const popularMyRecipes = useMemo(
    () => pickPopularMyRecipes(myRecipeList, MY_RECIPE_TOP_N),
    [myRecipeList]
  );

  useEffect(() => {
    if (userInfo?.nickName) {
      setNickname(userInfo.nickName);
    }
  }, [userInfo]);

  const openInfoModal = () => {
    if (!userInfo) {
      alert("회원 정보를 불러온 뒤 다시 시도해주세요.");
      return;
    }
    setShowInfoModal(true);
  };

  const openEditModal = () => {
    if (!userInfo) {
      alert("회원 정보를 불러온 뒤 다시 시도해주세요.");
      return;
    }
    setEditNickName((userInfo.nickName ?? "").trim());
    setEditTel((userInfo.tel ?? "").trim());
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    const nick = editNickName.trim();
    if (!nick) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    setEditSubmitting(true);
    try {
      await updateUserProfile({ nickName: nick, tel: editTel.trim() });
      await revalidateUserInfo();
      syncStoredUserProfile({ nickName: nick, tel: editTel.trim() });
      setNickname(nick);
      setShowEditModal(false);
      alert("프로필이 저장되었습니다.");
    } catch (e) {
      alert(e instanceof Error ? e.message : "프로필 저장에 실패했습니다.");
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[320px,1fr]">
      {loading && (
        <div
          className="md:col-span-2 flex flex-col items-center justify-center gap-3 rounded-[28px] border border-stone-200/90 bg-white/90 px-6 py-12 shadow-sm ring-1 ring-stone-900/[0.03]"
          role="status"
          aria-live="polite"
        >
          <span className="h-9 w-9 animate-spin rounded-full border-2 border-stone-200 border-t-orange-500" />
          <p className="text-sm text-stone-600">정보를 불러오는 중입니다…</p>
        </div>
      )}
      {error && !loading && (
        <div className="md:col-span-2 rounded-[20px] border border-red-200/90 bg-red-50/90 px-5 py-5 text-sm text-red-800 shadow-sm ring-1 ring-red-900/5">
          {error instanceof Error ? error.message : String(error)}
        </div>
      )}
      <section className="rounded-[28px] border border-stone-200/90 bg-white/95 p-6 shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.03]">
        {/* 프로필 헤더 - 모바일: 세로 배치, 데스크톱: 좌우 배치 + 오른쪽에 아이콘 버튼 */}
        <div className="relative overflow-hidden rounded-[24px] border border-stone-200/80 bg-gradient-to-br from-stone-50 via-orange-50/50 to-amber-50/40 px-6 py-8 lg:px-8 lg:py-10">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            {/* 프로필 정보 영역 */}
            <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:gap-6 lg:flex-1">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-sm lg:h-24 lg:w-24">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  className="h-10 w-10 text-stone-500 lg:h-12 lg:w-12"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c1.5-3 4.5-5 8-5s6.5 2 8 5" />
                </svg>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-700/80 lg:text-sm">
                  Profile
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-stone-900 lg:text-3xl">{nickname}</p>
                <p className="mt-1 text-sm text-stone-600 lg:text-base">나의 LesChef 요리 여정</p>
              </div>
            </div>

            {/* 데스크톱: 아이콘 버튼들 (오른쪽 배치) */}
            <div className="relative z-10 hidden items-center gap-3 lg:flex">
              {/* 정보확인 */}
              <button
                type="button"
                onClick={openInfoModal}
                className="flex flex-col items-center justify-center rounded-xl border border-stone-200/90 bg-white/95 px-4 py-3 text-stone-600 shadow-sm transition-all duration-200 hover:border-stone-300 hover:bg-white hover:text-stone-900 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
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
                type="button"
                onClick={openEditModal}
                className="flex flex-col items-center justify-center rounded-xl border border-stone-200/90 bg-white/95 px-4 py-3 text-stone-600 shadow-sm transition-all duration-200 hover:border-stone-300 hover:bg-white hover:text-stone-900 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
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
                className="flex flex-col items-center justify-center rounded-xl border border-stone-200/90 bg-white/95 px-4 py-3 text-stone-600 shadow-sm transition-all duration-200 hover:border-stone-300 hover:bg-white hover:text-stone-900 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
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
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex flex-col items-center justify-center rounded-xl border border-red-200/90 bg-white/95 px-4 py-3 text-red-600 shadow-sm transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
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
          <button
            type="button"
            onClick={openInfoModal}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            정보확인
          </button>
          <button
            type="button"
            onClick={openEditModal}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            정보변경
          </button>
          <button
            type="button"
            onClick={openPasswordModal}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            비밀번호 변경
          </button>

          {/* 회원 탈퇴 버튼 */}
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full rounded-2xl border border-red-200/90 bg-white px-4 py-3 text-sm font-medium text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            회원 탈퇴
          </button>
        </div>
      </section>

      <section className="space-y-6">
        {/* SNS 계정 연동 섹션 */}
        <div className="rounded-[28px] border border-stone-200/90 bg-white/95 px-6 py-6 shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.03]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-600/90">
                Account Link
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
                SNS 계정 연동
              </h2>
            </div>
          </div>
          <p className="mb-4 text-sm text-stone-600">
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
                  : "border border-stone-200/90 text-stone-700 hover:border-stone-400 hover:text-stone-900"
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
                  : "border border-stone-200/90 text-stone-700 hover:border-stone-400 hover:text-stone-900"
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
                  : "border border-stone-200/90 text-stone-700 hover:border-stone-400 hover:text-stone-900"
              }`}
            >
              {userInfo?.naverLinked ? "네이버 연동 해제" : "네이버 계정 연동"}
            </button>
          </div>
        </div>

        <div className="rounded-[28px] border border-stone-200/90 bg-white/95 px-6 py-6 shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.03]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-600/90">
                Inventory Alert
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
                기한 임박 물품
              </h2>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-xs tabular-nums ${
                expiryLoading
                  ? "border-stone-200/90 text-stone-400"
                  : alertTotal > 0
                    ? "border-orange-200 bg-orange-50 font-medium text-orange-800"
                    : "border-stone-200/90 text-stone-500"
              }`}
            >
              {expiryLoading ? "불러오는 중…" : `${alertTotal}건`}
            </span>
          </div>

          {expiryLoading && (
            <div className="mt-6 text-sm text-stone-500">유통기한 정보를 불러오는 중입니다…</div>
          )}
          {expiryError && !expiryLoading && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {expiryError instanceof Error
                ? expiryError.message
                : "유통기한 정보를 불러오지 못했습니다."}
            </div>
          )}
          {!expiryLoading && !expiryError && expiryAlerts && (
            <>
              {alertTotal > 0 ? (
                <div className="mt-6 space-y-4">
                  <ExpiryAlerts alerts={expiryAlerts} />
                  <ul className="space-y-2" aria-label="임박 재료 미리보기">
                    {expiryPreview.map((row, idx) => (
                      <li
                        key={`${row.food._id}-${row.place}-${idx}`}
                        className="flex items-start gap-3 rounded-2xl border border-stone-100 bg-stone-50/80 px-4 py-3 text-sm"
                      >
                        <span
                          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${severityDotClass(row.severity)}`}
                          aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-stone-900">
                            {row.food.name?.trim() || "이름 없음"}
                          </p>
                          <p className="text-xs text-stone-500">
                            <span className="font-medium text-stone-600">
                              {severityLabel(row.severity)}
                            </span>
                            {" · "}
                            {row.place.trim() || "보관함"}
                            {" · "}
                            {formatExpiryHint(row.food)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {alertTotal > expiryPreview.length && (
                    <p className="text-center text-xs text-stone-500">
                      외 {alertTotal - expiryPreview.length}건은 보관함에서 확인할 수 있어요.
                    </p>
                  )}
                  <div className="flex justify-center pt-1">
                    <Link
                      href="/myPage/storage"
                      className="inline-flex items-center justify-center rounded-2xl border border-stone-200/90 bg-white px-5 py-2.5 text-sm font-semibold text-stone-900 hover:bg-stone-50/80"
                    >
                      보관함에서 전체 관리하기
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-stone-200/90 bg-stone-50/80 px-4 py-12 text-center text-sm text-stone-400">
                  아직 임박한 재료가 없어요. 보관함에 재료를 추가하면 여기에서 바로 확인할 수 있어요.
                </div>
              )}
            </>
          )}
        </div>

        <div className="rounded-[28px] border border-stone-200/90 bg-white/95 px-6 py-6 shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.03]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-600/90">
                My Recipes
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
                나의 인기 레시피
              </h2>
              <p className="mt-1 text-xs text-stone-500">
                조회수·평점·리뷰 수를 반영한 점수로, 내가 작성한 레시피 중 상위 {MY_RECIPE_TOP_N}개를
                보여줘요.
              </p>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-xs tabular-nums ${
                myRecipesLoading
                  ? "border-stone-200/90 text-stone-400"
                  : myRecipeTotal > 0
                    ? "border-orange-600 bg-orange-600 font-medium text-white shadow-sm"
                    : "border-stone-200/90 text-stone-500"
              }`}
            >
              {myRecipesLoading
                ? "불러오는 중…"
                : myRecipeTotal > 0
                  ? `작성 ${myRecipeTotal}개`
                  : "작성 0개"}
            </span>
          </div>

          {myRecipesLoading && (
            <div className="mt-6 text-sm text-stone-500">나의 레시피를 불러오는 중입니다…</div>
          )}
          {myRecipesError && !myRecipesLoading && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {myRecipesError instanceof Error
                ? myRecipesError.message
                : "나의 레시피를 불러오지 못했습니다."}
            </div>
          )}
          {!myRecipesLoading && !myRecipesError && myRecipeTotal === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-stone-200/90 bg-stone-50/80 px-4 py-12 text-center text-sm text-stone-400">
              아직 작성한 레시피가 없어요. 레시피를 등록하면 여기에서 인기 순 요약을 볼 수 있어요.
              <div className="mt-4 flex justify-center">
                <Link
                  href="/myPage/recipes/write"
                  className="inline-flex items-center justify-center rounded-2xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
                >
                  레시피 작성하기
                </Link>
              </div>
            </div>
          )}
          {!myRecipesLoading && !myRecipesError && myRecipeTotal > 0 && (
            <div className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {popularMyRecipes.map((recipe) => (
                  <Link
                    key={recipe._id}
                    href={recipe._id ? `/recipe/detail?id=${recipe._id}` : "/recipe/all"}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.03] transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                    aria-label={`${recipe.recipeName} 상세로 이동`}
                  >
                    <div className="relative aspect-[5/3] w-full bg-gradient-to-br from-stone-50 to-stone-100">
                      {recipe.recipeImg ? (
                        <Image
                          src={recipe.recipeImg}
                          alt={recipe.recipeName}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-xs text-stone-400">
                          <span className="text-2xl" aria-hidden>
                            📷
                          </span>
                          <span>이미지 없음</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <h3 className="line-clamp-2 text-sm font-semibold text-stone-900 group-hover:text-stone-900">
                        {recipe.recipeName}
                      </h3>
                      <p className="text-xs text-stone-500">
                        조회 <span className="font-medium text-stone-700">{recipe.viewCount ?? 0}</span>
                        {typeof recipe.averageRating === "number" && (
                          <>
                            {" "}
                            · 평점{" "}
                            <span className="font-medium text-stone-700">
                              {recipe.averageRating.toFixed(1)}
                            </span>
                          </>
                        )}
                        {typeof recipe.reviewCount === "number" && recipe.reviewCount > 0 && (
                          <span className="text-stone-400"> ({recipe.reviewCount}리뷰)</span>
                        )}
                      </p>
                      {(recipe.subCategory || recipe.majorCategory) && (
                        <span className="mt-auto w-fit rounded-full border border-stone-200/90 px-2.5 py-0.5 text-[11px] text-stone-600">
                          #{recipe.subCategory || recipe.majorCategory}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                <Link
                  href="/myPage/recipes"
                  className="inline-flex items-center justify-center rounded-2xl border border-stone-200/90 bg-white px-5 py-2.5 text-sm font-semibold text-stone-900 hover:bg-stone-50/80"
                >
                  나의 레시피 전체
                </Link>
                <Link
                  href="/myPage/recipes/write"
                  className="inline-flex items-center justify-center rounded-2xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                >
                  새 레시피 작성
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 정보확인 모달 */}
      {showInfoModal && userInfo && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/45 px-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="info-view-title"
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[28px] border border-stone-200/90 bg-white p-6 shadow-xl shadow-stone-900/10 ring-1 ring-stone-900/[0.04]">
            <h3 id="info-view-title" className="text-lg font-semibold text-stone-900">
              회원 정보
            </h3>
            <p className="mt-1 text-xs text-stone-500">가입 시 등록된 정보입니다. 수정은 「정보변경」에서 할 수 있어요.</p>
            <div className="mt-4">
              <InfoField label="아이디" value={userInfo.id} />
              <InfoField label="이름" value={userInfo.name} />
              <InfoField label="닉네임" value={userInfo.nickName} />
              <InfoField label="전화번호" value={userInfo.tel} />
              <InfoField
                label="관리자"
                value={userInfo.checkAdmin ? "예" : "아니오"}
              />
              <InfoField
                label="SNS 연동"
                value={[
                  userInfo.kakaoLinked ? "카카오" : null,
                  userInfo.googleLinked ? "구글" : null,
                  userInfo.naverLinked ? "네이버" : null,
                ]
                  .filter(Boolean)
                  .join(", ") || "없음"}
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 정보변경 모달 */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/45 px-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="info-edit-title"
        >
          <div className="w-full max-w-md rounded-[28px] border border-stone-200/90 bg-white p-6 shadow-xl shadow-stone-900/10 ring-1 ring-stone-900/[0.04]">
            <h3 id="info-edit-title" className="text-lg font-semibold text-stone-900">
              프로필 수정
            </h3>
            <p className="mt-1 text-xs text-stone-500">
              아이디·이름은 변경할 수 없습니다. 닉네임과 전화번호만 수정됩니다.
            </p>
            {userInfo && (
              <p className="mt-2 rounded-xl bg-stone-50/80 px-3 py-2 text-xs text-stone-600">
                아이디: <span className="font-medium text-stone-900">{userInfo.id}</span>
                {userInfo.name ? (
                  <>
                    {" "}
                    · 이름: <span className="font-medium text-stone-900">{userInfo.name}</span>
                  </>
                ) : null}
              </p>
            )}
            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="edit-nick" className="mb-1 block text-xs font-medium text-stone-600">
                  닉네임 <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-nick"
                  type="text"
                  value={editNickName}
                  onChange={(e) => setEditNickName(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/30 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-orange-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/25"
                  autoComplete="nickname"
                />
              </div>
              <div>
                <label htmlFor="edit-tel" className="mb-1 block text-xs font-medium text-stone-600">
                  전화번호
                </label>
                <input
                  id="edit-tel"
                  type="tel"
                  value={editTel}
                  onChange={(e) => setEditTel(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/30 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-orange-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/25"
                  autoComplete="tel"
                  placeholder="선택 입력"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                disabled={editSubmitting}
                className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => void handleEditSave()}
                disabled={editSubmitting}
                className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:opacity-50"
              >
                {editSubmitting ? "저장 중…" : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 비밀번호 변경 모달 */}
      {showPwdModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/45 px-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwd-modal-title"
        >
          <div className="w-full max-w-md rounded-[28px] border border-stone-200/90 bg-white p-6 shadow-xl shadow-stone-900/10 ring-1 ring-stone-900/[0.04]">
            <h3 id="pwd-modal-title" className="text-lg font-semibold text-stone-900">
              비밀번호 변경
            </h3>
            <p className="mt-1 text-xs text-stone-500">8자 이상, 영문과 숫자를 포함해야 합니다.</p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-stone-600">
                  현재 비밀번호
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/30 px-3 py-2 text-sm text-stone-900 transition focus:border-orange-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/25"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-stone-600">새 비밀번호</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/30 px-3 py-2 text-sm text-stone-900 transition focus:border-orange-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/25"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-stone-600">
                  새 비밀번호 확인
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/30 px-3 py-2 text-sm text-stone-900 transition focus:border-orange-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/25"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPwdModal(false)}
                disabled={pwdSubmitting}
                className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => void handlePasswordChange()}
                disabled={pwdSubmitting}
                className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:opacity-50"
              >
                {pwdSubmitting ? "처리 중…" : "변경"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 회원 탈퇴 확인 모달 */}
      <DeleteAccount
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        accountUserType={userInfo?.userType}
      />
    </div>
  );
}

export default function InfoPage() {
  return (
    <Suspense
      fallback={
        <div className="grid gap-6 md:grid-cols-[320px,1fr]">
          <div className="md:col-span-2 flex min-h-[400px] flex-col items-center justify-center gap-3">
            <span className="h-9 w-9 animate-spin rounded-full border-2 border-stone-200 border-t-orange-500" />
            <p className="text-sm text-stone-500" role="status">
              불러오는 중…
            </p>
          </div>
        </div>
      }
    >
      <InfoPageContent />
    </Suspense>
  );
}
