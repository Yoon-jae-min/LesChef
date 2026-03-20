/**
 * 보관 장소 API 함수
 * 보관 장소 추가, 수정, 삭제, 조회 관련 함수들
 */

import { API_CONFIG } from "@/config/apiConfig";
import { fetchJson } from "./utils";
import type { FoodsListResponse } from "./types";

const API_BASE_URL = API_CONFIG.FOODS_API;

/**
 * 식재료 목록 조회
 * @returns Promise<FoodsListResponse>
 */
export const fetchFoodsList = async (): Promise<FoodsListResponse> => {
  return fetchJson<FoodsListResponse>(`${API_BASE_URL}/place`, { method: "GET" });
};

/**
 * 보관 장소 추가
 * @param placeName 보관 장소 이름
 * @returns Promise<FoodsListResponse>
 */
export const addStoragePlace = async (placeName: string): Promise<FoodsListResponse> => {
  if (!placeName || placeName.trim() === "") {
    throw new Error("보관 장소 이름을 입력해주세요.");
  }

  return fetchJson<FoodsListResponse>(`${API_BASE_URL}/place`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ placeName }),
  });
};

/**
 * 보관 장소 이름 변경 (MongoDB place 서브도큐먼트 _id)
 */
export const updateStoragePlace = async (
  placeId: string,
  changeName: string
): Promise<FoodsListResponse> => {
  if (!placeId || !changeName?.trim()) {
    throw new Error("장소 ID와 변경할 이름이 필요합니다.");
  }

  return fetchJson<FoodsListResponse>(`${API_BASE_URL}/place`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ placeId, changeName: changeName.trim() }),
  });
};

/**
 * 보관 장소 삭제 (MongoDB place 서브도큐먼트 _id)
 */
export const deleteStoragePlace = async (placeId: string): Promise<FoodsListResponse> => {
  if (!placeId) {
    throw new Error("보관 장소 ID가 필요합니다.");
  }

  return fetchJson<FoodsListResponse>(`${API_BASE_URL}/place`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ placeId }),
  });
};
