/**
 * API 설정
 * 모든 API URL을 중앙에서 관리
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://localhost:443",
  RECIPE_API: process.env.NEXT_PUBLIC_RECIPE_API_URL || "http://localhost:3000/api/recipe",
  BOARD_API: process.env.NEXT_PUBLIC_BOARD_API_URL || "http://localhost:3000/api/board",
  CUSTOMER_API: process.env.NEXT_PUBLIC_CUSTOMER_API_URL || "http://localhost:3000/api/customer",
} as const;

