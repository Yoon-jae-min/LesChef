/**
 * 게시판 댓글 API 함수
 * 게시글 댓글 작성 관련 함수들
 */

import { API_CONFIG } from "@/config/apiConfig";

const API_BASE_URL = API_CONFIG.BOARD_API;

/**
 * 댓글 작성
 * @param data 댓글 작성 데이터
 * @returns Promise<Response>
 */
export const createBoardComment = async (data: {
  boardId: string;
  content: string;
  nickName?: string;
  userId?: string;
}): Promise<Response> => {
  const { boardId, content } = data;

  if (!boardId || !content) {
    throw new Error("게시글 ID와 댓글 내용은 필수입니다.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/commentWrite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        boardId,
        content,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      let errorMessage = `댓글 작성 실패: ${response.status}`;
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
    throw new Error("댓글 작성 중 네트워크 오류가 발생했습니다.");
  }
};

