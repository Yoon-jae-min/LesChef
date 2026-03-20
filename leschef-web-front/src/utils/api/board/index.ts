/**
 * 게시판 API 유틸리티 함수
 * 하위 호환성을 위한 인덱스 파일
 * 모든 타입과 함수를 re-export
 */

// 타입 정의
export type {
  BoardWriteData,
  BoardEditData,
  BoardListParams,
  BoardListResponse,
  BoardDetailResponse,
  ToggleBoardLikeResponse,
} from "./types";

// CRUD 함수들
export { createBoard, updateBoard, deleteBoard } from "./crud";

// 조회 함수들
export { fetchBoardList, fetchBoardDetail } from "./queries";

// 좋아요 함수
export { toggleBoardLike } from "./like";

// 댓글 함수
export { createBoardComment } from "./comment";
