/**
 * 게시판 API 유틸리티 함수
 * 서버로 게시판 데이터를 전송하는 함수들
 */

import { API_CONFIG } from "@/config/apiConfig";

const API_BASE_URL = API_CONFIG.BOARD_API;

export type BoardWriteData = {
  title: string;
  content: string;
  id?: string; // 사용자 ID (서버에서 세션으로 가져올 수도 있음)
  nickName?: string; // 사용자 닉네임 (서버에서 세션으로 가져올 수도 있음)
};

export type BoardEditData = {
  id: string; // 게시글 ID (URL 파라미터로 사용)
  title: string;
  content: string;
};

export type BoardListParams = {
  page?: number;
  limit?: number;
};

export type BoardListResponse = {
  list: Array<{
    _id: string;
    title: string;
    nickName?: string;
    userId?: string;
    viewCount?: number;
    createdAt?: string;
    updatedAt?: string;
  }>;
  page: number;
  limit: number;
  total: number;
};

export type BoardDetailResponse = {
  content: {
    _id: string;
    title: string;
    nickName?: string;
    userId?: string;
    viewCount?: number;
    content: string;
    createdAt?: string;
    updatedAt?: string;
  };
  comments: Array<{
    _id: string;
    boardId: string;
    nickName?: string;
    userId?: string;
    content: string;
    createdAt?: string;
  }>;
  likeCount?: number;
  liked?: boolean;
};

export type ToggleBoardLikeResponse = {
  liked: boolean;
  likeCount: number;
};

/**
 * 게시글 작성
 * @param data 게시글 작성 데이터
 * @returns Promise<Response>
 */
export const createBoard = async (data: BoardWriteData): Promise<Response> => {
  const { title, content } = data;

  if (!title || !content) {
    throw new Error("제목과 내용은 필수입니다.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/write`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
      }),
      credentials: "include", // 세션 쿠키를 포함하기 위해
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
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
      }),
      credentials: "include",
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
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      credentials: "include",
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

/** 게시글 리스트 조회 */
export const fetchBoardList = async (params: BoardListParams = {}): Promise<BoardListResponse> => {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    const response = await fetch(`${API_BASE_URL}/list?${query.toString()}`, {
      method: "GET",
      credentials: "include",
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

/** 게시글 상세 조회 */
export const fetchBoardDetail = async (id: string): Promise<BoardDetailResponse> => {
  if (!id) {
    throw new Error("게시글 ID가 필요합니다.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/watch?id=${encodeURIComponent(id)}`, {
      method: "GET",
      credentials: "include",
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

/** 게시글 좋아요 토글 */
export const toggleBoardLike = async (boardId: string): Promise<ToggleBoardLikeResponse> => {
  if (!boardId) {
    throw new Error("게시글 ID가 필요합니다.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ boardId }),
      credentials: "include",
    });

    if (!response.ok) {
      let errorMessage = `좋아요 토글 실패: ${response.status}`;
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
    throw new Error("좋아요 토글 중 네트워크 오류가 발생했습니다.");
  }
};

/** 댓글 작성 */
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

