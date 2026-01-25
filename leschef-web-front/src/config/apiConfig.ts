/**
 * API 설정
 * 모든 API URL을 중앙에서 관리
 * 
 * [개발 환경]
 * - 현재: HTTP (http://localhost:3001)
 * - 프로덕션 복구 시: HTTPS (https://localhost:443)로 변경 필요
 */
const BASE_URL = "http://localhost:3001";

export const API_CONFIG = {
  BASE_URL,
  RECIPE_API: `${BASE_URL}/recipe`,
  BOARD_API: `${BASE_URL}/board`,
  CUSTOMER_API: `${BASE_URL}/customer`,
  FOODS_API: `${BASE_URL}/foods`,
} as const;

