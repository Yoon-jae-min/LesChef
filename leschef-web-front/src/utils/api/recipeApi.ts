/**
 * 레시피 API 유틸리티 함수
 * 하위 호환성을 위한 인덱스 파일
 * 모든 타입과 함수를 re-export
 */

// 타입 정의
export type {
  Ingredient,
  IngredientGroup,
  RecipeStep,
  RecipeInfo,
  RecipeSubmitData,
  RecipeSortOption,
  RecipeListParams,
  RecipeListItem,
  RecipeListResponse,
  RecipeDetailResponse,
  MyRecipeListResponse,
  WishRecipeListResponse,
  ToggleWishResponse,
} from "@/types/recipe";

// CRUD 함수들
export {
  submitRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../recipe/crud";

// 조회 함수들
export {
  fetchRecipeList,
  fetchRecipeDetail,
  fetchMyRecipeList,
  fetchWishRecipeList,
} from "../recipe/queries";

// 찜 기능
export {
  toggleRecipeWish,
} from "../recipe/wish";

