/**
 * 게시판 CRUD API 함수
 * 게시글 생성, 수정, 삭제 관련 함수들
 */

import { API_CONFIG } from "@/config/apiConfig";
import type { BoardWriteData, BoardEditData } from "./types";
import { authFetch } from "@/utils/api/authFetch";

const API_BASE_URL = API_CONFIG.BOARD_API;

/**
 * 게시글 작성
 * @param data 게시글 작성 데이터
 * @returns Promise<Response>
 */
export const createBoard = async (data: BoardWriteData): Promise<Response> => {
  const { title, content, boardType } = data;

  if (!title || !content) {
    throw new Error("제목과 내용은 필수입니다.");
  }

  try {
    const response = await authFetch(`${API_BASE_URL}/write`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        ...(boardType ? { boardType } : {}),
      }),
    });

    if (!response.ok) {
      let errorMessage = `게시글 작성 실패: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("게시글 작성 중 네트워크 오류가 발생했습니다.");
  }
};

/**
 * 게시글 수정
 * @param data 게시글 수정 데이터
 * @returns Promise<Response>
 */
export const updateBoard = async (data: BoardEditData): Promise<Response> => {
  const { id, title, content } = data;

  if (!id || !title || !content) {
    throw new Error("게시글 ID, 제목, 내용은 필수입니다.");
  }

  try {
    const response = await authFetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
      }),
    });

    if (!response.ok) {
      let errorMessage = `게시글 수정 실패: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("게시글 수정 중 네트워크 오류가 발생했습니다.");
  }
};

/**
 * 게시글 삭제
 * @param id 게시글 ID
 * @returns Promise<Response>
 */
export const deleteBoard = async (id: string): Promise<Response> => {
  if (!id) {
    throw new Error("게시글 ID가 필요합니다.");
  }

  try {
    const response = await authFetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      let errorMessage = `게시글 삭제 실패: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("게시글 삭제 중 네트워크 오류가 발생했습니다.");
  }
};
