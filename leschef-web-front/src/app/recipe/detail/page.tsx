import { getRecipeDetailServer } from "@/utils/api/serverApi";
import DetailClient from "@/components/recipe/detail/DetailClient";

/**
 * 레시피 상세 페이지 (서버 컴포넌트)
 * 서버에서 초기 데이터를 가져와서 렌더링
 * 클라이언트 컴포넌트는 인터랙션을 위해 사용
 */
export default async function RecipeDetailPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; recipeName?: string }>;
}) {
  // Next.js 15: searchParams는 Promise이므로 await 필요
  const params = await searchParams;
  const recipeId = params.id || "";
  const recipeNameParam = params.recipeName || "";

  // 서버에서 초기 데이터 가져오기
  let initialData = null;
  let error = null;

  if (recipeNameParam) {
    try {
      initialData = await getRecipeDetailServer(recipeNameParam);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("서버에서 레시피 상세 가져오기 실패:", err);
      }
      error = err instanceof Error ? err.message : "레시피를 불러오지 못했습니다.";
    }
      }

  return (
    <DetailClient 
      recipeId={recipeId}
      recipeNameParam={recipeNameParam}
      initialData={initialData}
      initialError={error}
    />
  );
}
