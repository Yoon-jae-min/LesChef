/**
 * 보관함 항목 이미지 업로드 (multipart)
 */

import { API_CONFIG } from "@/config/apiConfig";

const API_BASE_URL = API_CONFIG.FOODS_API;

export type UploadFoodItemImageResponse = {
  error: false;
  imageUrl: string;
};

export async function uploadFoodItemImage(file: File): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append("itemImage", file);

  const response = await fetch(`${API_BASE_URL}/upload-item-image`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    /* ignore */
  }

  if (!response.ok || !data || typeof data !== "object") {
    const msg =
      (data as { message?: string })?.message || `이미지 업로드 실패 (${response.status})`;
    throw new Error(msg);
  }

  const body = data as UploadFoodItemImageResponse & { error?: boolean };
  if (body.error !== false || !body.imageUrl) {
    throw new Error((data as { message?: string }).message || "이미지 업로드에 실패했습니다.");
  }

  return { imageUrl: body.imageUrl };
}
