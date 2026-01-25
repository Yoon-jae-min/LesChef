/**
 * 유통기한 알림 API 함수
 * 유통기한 알림 조회 관련 함수들
 */

import { API_CONFIG } from "@/config/apiConfig";
import { fetchJson } from "./utils";
import type { ExpiryAlertResponse } from "./types";

const API_BASE_URL = API_CONFIG.FOODS_API;

/**
 * 유통기한 알림 조회
 * @param status 알림 상태 필터 ('expired' | 'urgent' | 'warning' | 'notice' | 'all')
 * @returns Promise<ExpiryAlertResponse>
 */
export const fetchExpiryAlerts = async (
  status?: 'expired' | 'urgent' | 'warning' | 'notice' | 'all'
): Promise<ExpiryAlertResponse> => {
  const query = status && status !== 'all' ? `?status=${status}` : '';
  return fetchJson<ExpiryAlertResponse>(`${API_BASE_URL}/expiry-alerts${query}`, { method: "GET" });
};

