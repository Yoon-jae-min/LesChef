/**
 * 게시글 좋아요 관리 커스텀 훅
 * 좋아요 토글 로직을 관리
 */

import { useCallback } from "react";
import { toggleBoardLike } from "@/utils/api/board";
import type { BoardDetailResponse } from "@/utils/api/board";
import { MutatorCallback } from "swr";

interface UseLikeProps {
  postId: string;
  detail: BoardDetailResponse | undefined;
  isLiked: boolean;
  likeCount: number;
  mutate: (
    data?:
      | BoardDetailResponse
      | Promise<BoardDetailResponse>
      | MutatorCallback<BoardDetailResponse>,
    shouldRevalidate?: boolean
  ) => Promise<BoardDetailResponse | undefined>;
}

export function useLike({ postId, detail, isLiked, likeCount, mutate }: UseLikeProps) {
  /**
   * 좋아요 토글 (Optimistic Updates 적용)
   */
  const handleToggleLike = useCallback(async () => {
    if (!postId || !detail) {
      alert("게시글 ID가 없습니다.");
      return;
    }

    // 1. 즉시 UI 업데이트 (낙관적 업데이트)
    const previousData = detail;
    const newLikedState = !isLiked;
    const newLikeCount = newLikedState ? likeCount + 1 : Math.max(0, likeCount - 1);

    mutate(
      {
        ...detail,
        liked: newLikedState,
        likeCount: newLikeCount,
      },
      false // 즉시 UI 업데이트, 서버 재검증 안 함
    );

    try {
      // 2. 백그라운드에서 실제 API 호출
      const result = await toggleBoardLike(postId);

      // 3. 서버 응답으로 최종 동기화
      mutate({ ...detail, liked: result.liked, likeCount: result.likeCount }, false);
    } catch (err) {
      // 4. 실패 시 이전 상태로 롤백
      mutate(previousData, false);
      if (process.env.NODE_ENV === "development") {
        console.error("좋아요 실패:", err);
      }
      alert("좋아요 처리에 실패했습니다. 로그인 상태를 확인해주세요.");
    }
  }, [postId, detail, isLiked, likeCount, mutate]);

  return {
    handleToggleLike,
  };
}
