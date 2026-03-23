import { getIngredientPricesServer } from "@/utils/api/serverApi";
import IngredientPriceFullView from "@/components/ingredient-price/IngredientPriceFullView";
import type { IngredientPriceResponse } from "@/utils/api/ingredientPrice";

/**
 * 식재료 물가 전체 페이지
 */
export default async function IngredientPricePage() {
  let initialData: IngredientPriceResponse | null = null;
  let initialError: string | null = null;

  try {
    const raw = await getIngredientPricesServer();
    initialData = raw as IngredientPriceResponse;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("서버에서 식재료 물가 조회 실패:", err);
    }
    initialError = err instanceof Error ? err.message : "식재료 물가 정보를 불러오지 못했습니다.";
  }

  return <IngredientPriceFullView initialData={initialData} initialError={initialError} />;
}
