import { getBoardDetailServer } from "@/utils/api/serverApi";
import BoardDetail from "@/components/board/BoardDetail";

/**
 * 게시판 상세 페이지 (서버 컴포넌트)
 * 서버에서 초기 데이터를 가져와서 렌더링
 * 클라이언트 컴포넌트는 인터랙션을 위해 사용
 */
export default async function BoardDetailPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; type?: string }>;
}) {
  // Next.js 15: searchParams는 Promise이므로 await 필요
  const params = await searchParams;
  const postId = params.id || "";
  const boardType = params.type || "notice";
  const category = boardType === "free" ? "자유게시판" : "공지사항";

  // 서버에서 초기 데이터 가져오기
  let initialData = null;
  let error = null;

  if (postId) {
    try {
      initialData = await getBoardDetailServer(postId);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("서버에서 게시글 상세 가져오기 실패:", err);
    }
      error = err instanceof Error ? err.message : "게시글을 불러오지 못했습니다.";
    }
    }

  return (
    <BoardDetail 
      postId={postId}
      initialCategory={category}
      initialData={initialData}
      initialError={error}
    />
  );
}
