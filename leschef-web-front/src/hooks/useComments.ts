/**
 * 게시글 댓글 관리 커스텀 훅
 * 댓글 추가, 삭제 로직을 관리
 */

import { useState, useCallback } from "react";
import { createBoardComment } from "@/utils/api/board";
import type { BoardDetailResponse } from "@/utils/api/board";
import { MutatorCallback } from "swr";

interface UseCommentsProps {
  postId: string;
  detail: BoardDetailResponse | undefined;
  comments: BoardDetailResponse["comments"];
  mutate: (
    data?: BoardDetailResponse | Promise<BoardDetailResponse> | MutatorCallback<BoardDetailResponse>,
    shouldRevalidate?: boolean
  ) => Promise<BoardDetailResponse | undefined>;
}

export function useComments({ postId, detail, comments, mutate }: UseCommentsProps) {
  const [comment, setComment] = useState("");

  /**
   * 댓글 추가 (Optimistic Updates 적용)
   */
  const handleAddComment = useCallback(async () => {
    if (!comment.trim() || !postId || !detail) return;

    const commentContent = comment.trim();
    const previousData = detail;

    // 1. 즉시 UI 업데이트 (낙관적 업데이트)
    const tempComment = {
      _id: `temp-${Date.now()}`, // 임시 ID
      boardId: postId,
      nickName: "나", // 임시 사용자명 (실제로는 서버에서 받아옴)
      userId: undefined,
      content: commentContent,
      createdAt: new Date().toISOString(),
    };

    mutate(
      {
        ...detail,
        comments: [...comments, tempComment],
      },
      false // 즉시 UI 업데이트, 서버 재검증 안 함
    );
    setComment("");

    try {
      // 2. 백그라운드에서 실제 API 호출
      const response = await createBoardComment({
        boardId: postId,
        content: commentContent,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      // 3. 서버 응답으로 최종 동기화 (서버에서 받은 실제 댓글 데이터로 교체)
      await mutate();
    } catch (err) {
      // 4. 실패 시 이전 상태로 롤백
      mutate(previousData, false);
      setComment(commentContent); // 작성 중이던 댓글 복원
      if (process.env.NODE_ENV === "development") {
        console.error("댓글 작성 실패:", err);
      }
      alert("댓글 작성에 실패했습니다.");
    }
  }, [comment, postId, detail, comments, mutate]);

  /**
   * 댓글 삭제 (Optimistic Updates 적용)
   */
  const handleDeleteComment = useCallback((id: string) => {
    if (!detail) return;
    
    // 로컬 상태 업데이트 (실제 삭제는 API에서 처리)
    // API에서 삭제 후 mutate() 호출 (현재는 optimistic update 사용)
    mutate(
      { ...detail, comments: comments.filter(c => c._id !== id) },
      false // optimistic update
    );
  }, [detail, comments, mutate]);

  return {
    comment,
    setComment,
    handleAddComment,
    handleDeleteComment,
  };
}

