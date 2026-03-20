import { getRecipeDetailServer } from "@/utils/api/serverApi";
import DetailClient from "@/components/recipe/detail/DetailClient";

/**
 * 레시피 상세 페이지 (서버 컴포넌트)
 * 쿼리: ?id=<MongoDB _id>
 */
export default async function RecipeDetailPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const recipeId = params.id || "";

  let initialData = null;
  let error = null;

  if (recipeId) {
    try {
      initialData = await getRecipeDetailServer(recipeId);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("서버에서 레시피 상세 가져오기 실패:", err);
      }
      error = err instanceof Error ? err.message : "레시피를 불러오지 못했습니다.";
    }
  } else {
    error = "레시피 id가 필요합니다.";
  }

  return <DetailClient recipeId={recipeId} initialData={initialData} initialError={error} />;
}
