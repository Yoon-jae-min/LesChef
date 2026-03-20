/**
 * 게시판 API 타입 정의
 */

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
