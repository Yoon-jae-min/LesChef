import { getRecipeListServer } from "@/utils/api/serverApi";
import List from "@/components/recipe/list/List";
import { RECIPE_CATEGORY_TO_API } from "@/constants/navigation/categories";

/**
 * 레시피 카테고리 페이지 (서버 컴포넌트)
 * 서버에서 초기 데이터를 가져와서 렌더링
 * 클라이언트 컴포넌트는 실시간 업데이트를 위해 사용
 */
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ subCategory?: string }>;
}) {
  // Next.js 15: params는 Promise이므로 await 필요
  const { category } = await params;
  const sp = (await searchParams) ?? {};
  const subCategoryParam = typeof sp.subCategory === "string" ? sp.subCategory.trim() : "";

  const categoryKey = category in RECIPE_CATEGORY_TO_API ? category : "korean";
  const apiCategory = RECIPE_CATEGORY_TO_API[categoryKey] || "korean";

  // 서버에서 초기 데이터 가져오기
  let initialData = null;
  let error = null;

  try {
    initialData = await getRecipeListServer({
      category: apiCategory as "all" | "korean" | "japanese" | "chinese" | "western" | "other",
      ...(subCategoryParam ? { subCategory: subCategoryParam } : {}),
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("서버에서 레시피 리스트 가져오기 실패:", err);
    }
    error = err instanceof Error ? err.message : "레시피를 불러오지 못했습니다.";
  }

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8">
      <List
        initialCategory={categoryKey}
        initialData={initialData}
        initialError={error}
        initialSubCategory={subCategoryParam || undefined}
      />
    </section>
  );
}
