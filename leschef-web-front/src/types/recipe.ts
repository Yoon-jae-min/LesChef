/**
 * 레시피 관련 타입 정의
 */

export type Ingredient = {
  ingredientName: string;
  volume: number;
  unit: string;
};

export type IngredientGroup = {
  sortType: string;
  ingredients: Ingredient[];
};

export type RecipeStep = {
  stepNum: number;
  stepWay: string;
  stepImg: string;
  stepImgFile?: File | null;
};

export type RecipeInfo = {
  recipeName: string;
  cookTime: number;
  portion: number;
  portionUnit: string;
  cookLevel: string;
  majorCategory: string;
  subCategory: string;
  recipeImg: string;
  viewCount?: number;
  _id?: string; // edit 모드일 때만 필요
};

export type RecipeSubmitData = {
  recipeInfo: RecipeInfo;
  ingredientGroups: IngredientGroup[];
  steps: RecipeStep[];
  recipeImgFile: File | null;
  isEdit?: boolean;
  recipeId?: string; // edit 모드일 때만 필요
  deleteImgs?: string[]; // edit 모드에서 삭제할 이미지 URL 배열
};

export type RecipeSortOption = "latest" | "views" | "popular" | "rating";

export type RecipeListParams = {
  category?: "all" | "korean" | "japanese" | "chinese" | "western" | "other";
  subCategory?: string;
  isShare?: boolean;
  page?: number;
  limit?: number;
  sort?: RecipeSortOption;
  keyword?: string; // 검색 키워드 (레시피 이름, 태그, 재료명)
  tag?: string; // 태그 검색
};

export type RecipeListItem = {
  _id?: string;
  recipeName: string;
  cookTime?: number;
  cookLevel?: string;
  majorCategory?: string;
  subCategory?: string;
  recipeImg?: string;
  viewCount?: number;
  averageRating?: number;
  reviewCount?: number;
};

export type RecipeListResponse = {
  list: RecipeListItem[];
  page: number;
  limit: number;
  total: number;
};

export type RecipeDetailResponse = {
  selectedRecipe: {
    _id?: string;
    recipeName: string;
    cookTime?: number;
    portion?: number;
    portionUnit?: string;
    cookLevel?: string;
    majorCategory?: string;
    subCategory?: string;
    recipeImg?: string;
    userId?: string;
    viewCount?: number;
  };
  recipeIngres: Array<{
    sortType: string;
    ingredientUnit: Array<{
      ingredientName: string;
      volume: number;
      unit: string;
    }>;
  }>;
  recipeSteps: Array<{
    stepNum: number;
    stepWay: string;
    stepImg: string;
  }>;
  recipeWish: boolean;
};

export type MyRecipeListResponse = {
  list: RecipeListItem[];
};

export type WishRecipeListResponse = {
  wishList: RecipeListItem[];
};

export type ToggleWishResponse = {
  recipeWish: boolean;
};
