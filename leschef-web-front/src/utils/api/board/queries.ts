/**
 * 게시판 조회 API 함수
 * 게시글 리스트, 상세 조회 관련 함수들
 */

import { API_CONFIG } from "@/config/apiConfig";
import type { BoardListParams, BoardListResponse, BoardDetailResponse } from "./types";

const API_BASE_URL = API_CONFIG.BOARD_API;

/**
 * 게시글 리스트 조회
 * @param params 조회 파라미터
 * @returns Promise<BoardListResponse>
 */
export const fetchBoardList = async (params: BoardListParams = {}): Promise<BoardListResponse> => {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.type) query.set("type", params.type);

    const response = await fetch(`${API_BASE_URL}/list?${query.toString()}`, {
      method: "GET",
    });

    if (!response.ok) {
      let errorMessage = `게시글 리스트 조회 실패: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("게시글 리스트 조회 중 네트워크 오류가 발생했습니다.");
  }
};

/**
 * 게시글 상세 조회
 * @param id 게시글 ID
 * @returns Promise<BoardDetailResponse>
 */
export const fetchBoardDetail = async (id: string): Promise<BoardDetailResponse> => {
  if (!id) {
    throw new Error("게시글 ID가 필요합니다.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/watch?id=${encodeURIComponent(id)}`, {
      method: "GET",
    });

    if (!response.ok) {
      let errorMessage = `게시글 상세 조회 실패: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("게시글 상세 조회 중 네트워크 오류가 발생했습니다.");
  }
};
