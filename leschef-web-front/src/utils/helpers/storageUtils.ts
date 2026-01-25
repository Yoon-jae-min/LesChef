/**
 * 보관 재료 관련 유틸리티 함수
 */

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * 유통기한까지 남은 일수 계산 (D-Day)
 * @param dateStr 날짜 문자열 (YYYY-MM-DD 형식)
 * @returns 남은 일수 (null: 유효하지 않은 날짜)
 */
export const getDday = (dateStr: string): number | null => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((target.getTime() - today.getTime()) / MS_PER_DAY);
  if (Number.isNaN(diffDays)) return null;
  return diffDays;
};

/**
 * 유통기한 우선순위 및 스타일 정보 반환
 * @param dday 남은 일수 (null: 정보 없음)
 * @returns 우선순위 라벨 및 스타일 클래스
 */
export const getPriority = (dday: number | null): { label: string; tone: string } => {
  if (dday === null) return { label: "정보 없음", tone: "bg-gray-100 text-gray-500 border-gray-200" };
  if (dday < 0) return { label: "폐기 필요", tone: "bg-red-50 text-red-600 border-red-200" };
  if (dday <= 2) return { label: "긴급", tone: "bg-orange-50 text-orange-600 border-orange-200" };
  if (dday <= 5) return { label: "주의", tone: "bg-yellow-50 text-yellow-600 border-yellow-200" };
  return { label: "안정", tone: "bg-green-50 text-green-600 border-green-200" };
};

/**
 * D-Day 포맷팅 (표시용)
 * @param dday 남은 일수
 * @returns 포맷된 문자열 (예: "D-3", "D-DAY", "D+2")
 */
export const formatDday = (dday: number | null): string => {
  if (dday === null) return "-";
  if (dday === 0) return "D-DAY";
  if (dday > 0) return `D-${dday}`;
  return `D+${Math.abs(dday)}`;
};

