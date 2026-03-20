import { getBoardListServer } from "@/utils/api/serverApi";
import BoardList from "@/components/board/BoardList";

/**
 * 게시판 카테고리 페이지 (서버 컴포넌트)
 * 서버에서 초기 데이터를 가져와서 렌더링
 * 클라이언트 컴포넌트는 실시간 업데이트를 위해 사용
 */
export default async function BoardCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  // Next.js 15: params는 Promise이므로 await 필요
  const { category } = await params;
  const categoryKey = category || "notice";

  // 서버에서 초기 데이터 가져오기
  let initialData = null;
  let error = null;

  try {
    initialData = await getBoardListServer({ page: 1, limit: 20 });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("서버에서 게시글 리스트 가져오기 실패:", err);
    }
    error = err instanceof Error ? err.message : "게시글을 불러오지 못했습니다.";
  }

  return <BoardList initialCategory={categoryKey} initialData={initialData} initialError={error} />;
}
