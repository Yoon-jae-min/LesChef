/**
 * 게시판 API 유틸리티 함수
 * 서버로 게시판 데이터를 전송하는 함수들
 */

// 예시 API 주소 (나중에 실제 주소로 변경)
const API_BASE_URL = "http://localhost:3000/api/board";

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
  const { title, content, id, nickName } = data;

  // 백엔드에서 id와 nickName을 body로 받고 있음
  // 세션에서 가져오는 경우 id와 nickName은 undefined로 전송해도 됨
  const response = await fetch(`${API_BASE_URL}/write`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      content,
      ...(id && { id }), // id가 있으면 포함
      ...(nickName && { nickName }), // nickName이 있으면 포함
    }),
    credentials: "include", // 세션 쿠키를 포함하기 위해
  });

  return response;
};

/**
 * 게시글 수정
 * @param data 게시글 수정 데이터
 * @returns Promise<Response>
 */
export const updateBoard = async (data: BoardEditData): Promise<Response> => {
  const { id, title, content } = data;

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

  return response;
};

/**
 * 게시글 삭제
 * @param id 게시글 ID
 * @returns Promise<Response>
 */
export const deleteBoard = async (id: string): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return response;
};

/** 게시글 리스트 조회 */
export const fetchBoardList = async (params: BoardListParams = {}): Promise<BoardListResponse> => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const response = await fetch(`${API_BASE_URL}/list?${query.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `게시글 리스트 조회 실패: ${response.status}`);
  }

  return response.json();
};

/** 게시글 상세 조회 */
export const fetchBoardDetail = async (id: string): Promise<BoardDetailResponse> => {
  const response = await fetch(`${API_BASE_URL}/watch?id=${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `게시글 상세 조회 실패: ${response.status}`);
  }

  return response.json();
};

/** 게시글 좋아요 토글 */
export const toggleBoardLike = async (boardId: string): Promise<ToggleBoardLikeResponse> => {
  const response = await fetch(`${API_BASE_URL}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ boardId }),
    credentials: "include",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `좋아요 토글 실패: ${response.status}`);
  }

  return response.json();
};

/** 댓글 작성 */
export const createBoardComment = async (data: {
  boardId: string;
  content: string;
  nickName?: string;
  userId?: string;
}): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}/commentWrite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  return response;
};

