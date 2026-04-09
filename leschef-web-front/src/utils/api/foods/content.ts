/**
 * 식재료 추가·수정·삭제
 */

import { API_CONFIG } from "@/config/apiConfig";
import { fetchJson } from "./utils";
import type { FoodsListResponse } from "./types";

const API_BASE_URL = API_CONFIG.FOODS_API;

export type AddFoodItemParams = {
  placeId: string;
  /** 업로드한 경우에만 전달 — 없으면 이름만으로 등록 */
  imageUrl?: string;
  name?: string;
  volume: number;
  unit: string;
  expiryDate: string;
};

export async function addFoodItem(params: AddFoodItemParams): Promise<FoodsListResponse> {
  const { placeId, imageUrl, name, volume, unit, expiryDate } = params;
  const img = (imageUrl ?? "").trim();
  const itemName = (name ?? "").trim();
  if (!placeId) {
    throw new Error("보관 장소가 필요합니다.");
  }
  if (!img && !itemName) {
    throw new Error("사진 또는 이름 중 하나는 입력해주세요.");
  }

  return fetchJson<FoodsListResponse>(`${API_BASE_URL}/content`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      placeId,
      imageUrl: img,
      unitName: itemName,
      unitVol: volume,
      unitUnit: unit,
      unitDate: expiryDate,
    }),
  });
}

export type UpdateFoodItemParams = {
  contentId: string;
  name: string;
  volume: number;
  unit: string;
  date: string;
  /** 새 파일 업로드 후에만 전달 */
  imageUrl?: string;
};

export async function updateFoodItem(params: UpdateFoodItemParams): Promise<FoodsListResponse> {
  const { contentId, name, volume, unit, date, imageUrl } = params;
  if (!contentId) {
    throw new Error("식재료 ID가 필요합니다.");
  }

  const body: Record<string, unknown> = {
    contentId,
    name,
    vol: volume,
    unit,
    date,
  };
  if (imageUrl !== undefined && imageUrl.trim()) {
    body.imageUrl = imageUrl.trim();
  }

  return fetchJson<FoodsListResponse>(`${API_BASE_URL}/content`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function deleteFoodItem(contentId: string): Promise<FoodsListResponse> {
  if (!contentId) {
    throw new Error("식재료 ID가 필요합니다.");
  }

  return fetchJson<FoodsListResponse>(`${API_BASE_URL}/content`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentId }),
  });
}
