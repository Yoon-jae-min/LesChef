/**
 * 유통기한 알림 기록 (마이페이지 알림함)
 * localStorage에 보관 — 토스트는 요약, 상세는 여기서 확인
 */

export type ExpiryInboxBucket = "expired" | "urgent" | "warning" | "notice";

export type ExpiryInboxEntry = {
  id: string;
  foodId: string;
  bucket: ExpiryInboxBucket;
  place: string;
  daysUntilExpiry: number | null;
  /** 있으면 부가 표시 */
  name?: string;
  imageUrl?: string;
  createdAt: number;
};

const KEY = "leschef_expiry_inbox" as const;
const MAX_ENTRIES = 200;

function parse(raw: string | null): ExpiryInboxEntry[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(
      (x): x is ExpiryInboxEntry =>
        typeof x === "object" &&
        x !== null &&
        typeof (x as ExpiryInboxEntry).id === "string" &&
        typeof (x as ExpiryInboxEntry).foodId === "string"
    );
  } catch {
    return [];
  }
}

export function getExpiryInbox(): ExpiryInboxEntry[] {
  if (typeof window === "undefined") return [];
  return parse(localStorage.getItem(KEY));
}

export function prependExpiryInboxEntries(entries: ExpiryInboxEntry[]): void {
  if (typeof window === "undefined" || entries.length === 0) return;
  const prev = getExpiryInbox();
  const next = [...entries, ...prev].slice(0, MAX_ENTRIES);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota */
  }
}

export function clearExpiryInbox(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function removeExpiryInboxEntry(id: string): void {
  if (typeof window === "undefined") return;
  const next = getExpiryInbox().filter((e) => e.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
}

/** 스토리지 키 — 외부에서 storage 이벤트 구독 시 사용 가능 */
export const EXPIRY_INBOX_STORAGE_KEY = KEY;
