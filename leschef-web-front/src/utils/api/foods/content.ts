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
 * @param placeName 보관 장소 이름
 * @param foodName 식재료 이름
 * @param volume 수량
 * @param unit 단위
 * @param expiryDate 유통기한
 * @returns Promise<FoodsListResponse>
 */
export const addFoodItem = async (
  placeName: string,
  foodName: string,
  volume: number,
  unit: string,
  expiryDate: string
): Promise<FoodsListResponse> => {
  if (!placeName || !foodName) {
    throw new Error("보관 장소 이름과 식재료 이름은 필수입니다.");
  }

  return fetchJson<FoodsListResponse>(`${API_BASE_URL}/content`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      placeName,
      unitName: foodName,
      unitVol: volume,
      unitUnit: unit,
      unitDate: expiryDate,
    }),
  });
};

/**
 * 식재료 수정
 * @param placeName 보관 장소 이름
 * @param contentId 식재료 ID
 * @param name 식재료 이름
 * @param volume 수량
 * @param unit 단위
 * @param date 유통기한
 * @returns Promise<FoodsListResponse>
 */
export const updateFoodItem = async (
  placeName: string,
  contentId: string,
  name: string,
  volume: number,
  unit: string,
  date: string
): Promise<FoodsListResponse> => {
  if (!placeName || !contentId || !name) {
    throw new Error("보관 장소 이름, 식재료 ID, 식재료 이름은 필수입니다.");
  }

  return fetchJson<FoodsListResponse>(`${API_BASE_URL}/content`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      placeName,
      contentId,
      name,
      vol: volume,
      unit,
      date,
    }),
  });
};

/**
 * 식재료 삭제
 * @param place 보관 장소 이름
 * @param food 식재료 이름
 * @returns Promise<FoodsListResponse>
 */
export const deleteFoodItem = async (
  place: string,
  food: string
): Promise<FoodsListResponse> => {
  if (!place || !food) {
    throw new Error("보관 장소 이름과 식재료 이름은 필수입니다.");
  }

  return fetchJson<FoodsListResponse>(`${API_BASE_URL}/content`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ place, food }),
  });
};

