/**
 * 식재료 관리 관련 상수
 */

// 유통기한 알림 기준일
export const EXPIRY_ALERT_DAYS = {
    URGENT: 1, // 긴급 (1일 이내)
    WARNING: 3, // 경고 (3일 이내)
    NOTICE: 7, // 알림 (7일 이내)
} as const;

// 식재료 상태
export type FoodStatus = 'expired' | 'urgent' | 'warning' | 'notice' | 'safe';

// 식재료 상태 라벨
export const FOOD_STATUS_LABELS: Record<FoodStatus, string> = {
    expired: '만료',
    urgent: '긴급',
    warning: '경고',
    notice: '알림',
    safe: '안전',
};

/**
 * 유통기한으로부터 남은 일수 계산
 *
 * 오늘 날짜와 유통기한 날짜를 비교하여 남은 일수를 계산합니다.
 * 시간 정보는 제거하고 날짜만 비교하여 정확한 일수 차이를 계산합니다.
 *
 * 반환값:
 * - 양수: 유통기한까지 남은 일수 (예: 5일 남음 → 5)
 * - 0: 오늘이 유통기한 (예: 오늘이 유통기한 → 0)
 * - 음수: 유통기한이 지난 일수 (예: 3일 지남 → -3)
 *
 * @param expiryDate - 유통기한 날짜
 * @returns 남은 일수 (음수 가능, 소수점 올림 처리)
 */
export function getDaysUntilExpiry(expiryDate: Date): number {
    const today = new Date();
    // 시간 정보 제거 (00:00:00으로 설정하여 날짜만 비교)
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    // 밀리초 단위 차이를 일 단위로 변환 (Math.ceil로 올림 처리)
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 식재료 상태 판단
 *
 * 유통기한까지 남은 일수를 기준으로 식재료의 상태를 판단합니다.
 * 상태는 우선순위에 따라 결정되며, 알림이 필요한 순서대로 분류됩니다.
 *
 * 상태 분류 기준:
 * - expired: 유통기한이 지남 (daysUntilExpiry < 0)
 * - urgent: 1일 이내 만료 예정 (0 <= daysUntilExpiry <= 1)
 * - warning: 3일 이내 만료 예정 (2 <= daysUntilExpiry <= 3)
 * - notice: 7일 이내 만료 예정 (4 <= daysUntilExpiry <= 7)
 * - safe: 7일 초과 (daysUntilExpiry > 7)
 *
 * @param expiryDate - 유통기한 날짜
 * @returns 식재료 상태 (FoodStatus 타입)
 */
export function getFoodStatus(expiryDate: Date): FoodStatus {
    const daysUntilExpiry = getDaysUntilExpiry(expiryDate);

    // 우선순위에 따라 상태 판단 (가장 긴급한 것부터 확인)
    if (daysUntilExpiry < 0) {
        return 'expired'; // 유통기한 지남
    } else if (daysUntilExpiry <= EXPIRY_ALERT_DAYS.URGENT) {
        return 'urgent'; // 1일 이내
    } else if (daysUntilExpiry <= EXPIRY_ALERT_DAYS.WARNING) {
        return 'warning'; // 3일 이내
    } else if (daysUntilExpiry <= EXPIRY_ALERT_DAYS.NOTICE) {
        return 'notice'; // 7일 이내
    } else {
        return 'safe'; // 7일 초과 (안전)
    }
}
