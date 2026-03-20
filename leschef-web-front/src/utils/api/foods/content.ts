/**
 * 식재료 API 함수
 * 식재료 추가, 수정, 삭제 관련 함수들
 */

import { API_CONFIG } from "@/config/apiConfig";
import { fetchJson } from "./utils";
import type { FoodsListResponse } from "./types";

const API_BASE_URL = API_CONFIG.FOODS_API;

/**
 * 식재료 추가
 * @param placeId 보관 장소 MongoDB 서브도큐먼트 _id
 * @param foodName 식재료 이름
 * @param volume 수량
 * @param unit 단위
 * @param expiryDate 유통기한
 * @returns Promise<FoodsListResponse>
 */
export const addFoodItem = async (
  placeId: string,
  foodName: string,
  volume: number,
  unit: string,
  expiryDate: string
): Promise<FoodsListResponse> => {
  if (!placeId || !foodName) {
    throw new Error("보관 장소 ID와 식재료 이름은 필수입니다.");
  }

  return fetchJson<FoodsListResponse>(`${API_BASE_URL}/content`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      placeId,
      unitName: foodName,
      unitVol: volume,
      unitUnit: unit,
      unitDate: expiryDate,
    }),
  });
};

/**
 * 식재료 수정 (contentId만으로 식별)
 * @param contentId 식재료 항목 MongoDB _id
 * @param name 식재료 이름
 * @param volume 수량
 * @param unit 단위
 * @param date 유통기한
 * @returns Promise<FoodsListResponse>
 */
export const updateFoodItem = async (
  contentId: string,
  name: string,
  volume: number,
  unit: string,
  date: string
): Promise<FoodsListResponse> => {
  if (!contentId || !name) {
    throw new Error("식재료 ID와 이름은 필수입니다.");
  }

  return fetchJson<FoodsListResponse>(`${API_BASE_URL}/content`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contentId,
      name,
      vol: volume,
      unit,
      date,
    }),
  });
};

/**
 * 식재료 삭제 (MongoDB foodList 항목 _id)
 * @param contentId 식재료 항목 _id
 * @returns Promise<FoodsListResponse>
 */
export const deleteFoodItem = async (contentId: string): Promise<FoodsListResponse> => {
  if (!contentId) {
    throw new Error("식재료 ID가 필요합니다.");
  }

  return fetchJson<FoodsListResponse>(`${API_BASE_URL}/content`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentId }),
  });
};
