/**
 * 레시피 API 유틸리티 함수
 * 서버로 레시피 데이터를 전송하는 함수들
 */

import { API_CONFIG } from "@/config/apiConfig";

const API_BASE_URL = API_CONFIG.RECIPE_API;

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

export type RecipeListParams = {
  category?: "all" | "korean" | "japanese" | "chinese" | "western" | "other";
  subCategory?: string;
  isShare?: boolean;
  page?: number;
  limit?: number;
  sort?: "latest" | "popular";
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

/**
 * 재료 데이터를 백엔드 형식으로 변환
 */
const transformIngredients = (
  ingredientGroups: IngredientGroup[],
): Array<{
  sortType: string;
  ingredientUnit: Array<{
    ingredientName: string;
    volume: number;
    unit: string;
  }>;
}> => {
  return ingredientGroups.map((group) => ({
    sortType: group.sortType,
    ingredientUnit: group.ingredients.map((ingredient) => ({
      ingredientName: ingredient.ingredientName,
      volume: ingredient.volume,
      unit: ingredient.unit,
    })),
  }));
};

/**
 * 조리 단계 데이터를 백엔드 형식으로 변환
 */
const transformSteps = (steps: RecipeStep[]): Array<{
  stepNum: number;
  stepWay: string;
  stepImg: string;
}> => {
  return steps.map((step) => ({
    stepNum: step.stepNum,
    stepWay: step.stepWay,
    stepImg: step.stepImg.startsWith("data:") ? "" : step.stepImg, // 새로 업로드한 이미지는 빈 문자열
  }));
};

/**
 * 레시피 작성/수정 데이터를 서버로 전송
 * @param data 레시피 제출 데이터
 * @returns Promise<Response>
 */
export const submitRecipe = async (data: RecipeSubmitData): Promise<Response> => {
  const { recipeInfo, ingredientGroups, steps, recipeImgFile, isEdit, recipeId, deleteImgs } = data;

  // FormData 생성
  const formData = new FormData();

  // recipeInfo 준비
  const recipeInfoData: RecipeInfo = {
    ...recipeInfo,
    viewCount: recipeInfo.viewCount || 0,
  };

  if (isEdit && recipeId) {
    recipeInfoData._id = recipeId;
  }

  // JSON 문자열로 변환하여 FormData에 추가
  formData.append("recipeInfo", JSON.stringify(recipeInfoData));

  // 재료 데이터 변환 및 추가 (recipeId는 서버에서 주입)
  const transformedIngredients = transformIngredients(ingredientGroups);
  formData.append("recipeIngredients", JSON.stringify(transformedIngredients));

  // 조리 단계 데이터 변환 및 추가
  const transformedSteps = transformSteps(steps);
  formData.append("recipeSteps", JSON.stringify(transformedSteps));

  // isEdit 플래그 추가
  formData.append("isEdit", JSON.stringify(isEdit || false));

  // edit 모드일 때 삭제할 이미지 URL 배열 추가
  if (isEdit && deleteImgs && deleteImgs.length > 0) {
    deleteImgs.forEach((imgUrl) => {
      formData.append("deleteImgs", imgUrl);
    });
  }

  // 대표 이미지 파일 추가
  if (recipeImgFile) {
    formData.append("recipeImgFile", recipeImgFile);
  }

  // 조리 단계 이미지 파일들 추가
  steps.forEach((step) => {
    if (step.stepImgFile) {
      formData.append("recipeStepImgFiles", step.stepImgFile);
    }
  });

  // 서버로 전송
  try {
    const response = await fetch(`${API_BASE_URL}/write`, {
      method: "POST",
      body: formData,
      // FormData를 사용할 때는 Content-Type을 설정하지 않음 (브라우저가 자동으로 설정)
      credentials: "include", // 세션 쿠키를 포함하기 위해
    });

    if (!response.ok) {
      let errorMessage = `레시피 제출 실패: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("레시피 제출 중 네트워크 오류가 발생했습니다.");
  }
};

/**
 * 레시피 작성 전용 함수 (편의 함수)
 */
export const createRecipe = async (data: Omit<RecipeSubmitData, "isEdit" | "recipeId" | "deleteImgs">): Promise<Response> => {
  return submitRecipe({
    ...data,
    isEdit: false,
  });
};

/**
 * 레시피 수정 전용 함수 (편의 함수)
 */
export const updateRecipe = async (
  data: Omit<RecipeSubmitData, "isEdit"> & { recipeId: string; deleteImgs?: string[] }
): Promise<Response> => {
  return submitRecipe({
    ...data,
    isEdit: true,
  });
};

/**
 * 레시피 리스트 조회 (단일 엔드포인트)
 */
export const fetchRecipeList = async (params: RecipeListParams = {}): Promise<RecipeListResponse> => {
  try {
    const query = new URLSearchParams();
    if (params.category) query.set("category", params.category);
    if (params.subCategory) query.set("subCategory", params.subCategory);
    if (typeof params.isShare !== "undefined") query.set("isShare", String(params.isShare));
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.sort) query.set("sort", params.sort);

    const response = await fetch(`${API_BASE_URL}/list?${query.toString()}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      let errorMessage = `리스트 조회 실패: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("레시피 리스트 조회 중 네트워크 오류가 발생했습니다.");
  }
};

/** 레시피 찜 토글 */
export const toggleRecipeWish = async (recipeId: string): Promise<ToggleWishResponse> => {
  if (!recipeId) {
    throw new Error("레시피 ID가 필요합니다.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/clickwish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipeId }),
      credentials: "include",
    });

    if (!response.ok) {
      let errorMessage = `찜 요청 실패: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("찜 요청 중 네트워크 오류가 발생했습니다.");
  }
};

/** 레시피 상세 조회 (recipeName 기준) */
export const fetchRecipeDetail = async (recipeName: string): Promise<RecipeDetailResponse> => {
  if (!recipeName) {
    throw new Error("레시피 이름이 필요합니다.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/info?recipeName=${encodeURIComponent(recipeName)}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      let errorMessage = `레시피 상세 조회 실패: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("레시피 상세 조회 중 네트워크 오류가 발생했습니다.");
  }
};

/** 나의 레시피 리스트 */
export const fetchMyRecipeList = async (): Promise<MyRecipeListResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/myList`, {
      method: "GET",
      credentials: "include",
    });
    
    if (!response.ok) {
      let errorMessage = `나의 레시피 조회 실패: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("나의 레시피 조회 중 네트워크 오류가 발생했습니다.");
  }
};

/** 찜한 레시피 리스트 */
export const fetchWishRecipeList = async (): Promise<WishRecipeListResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishList`, {
      method: "GET",
      credentials: "include",
    });
    
    if (!response.ok) {
      let errorMessage = `찜한 레시피 조회 실패: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("찜한 레시피 조회 중 네트워크 오류가 발생했습니다.");
  }
};

/**
 * 레시피 삭제
 * @param recipeId 레시피 ID
 * @returns Promise<Response>
 */
export const deleteRecipe = async (recipeId: string): Promise<Response> => {
  if (!recipeId) {
    throw new Error("레시피 ID가 필요합니다.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${recipeId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      let errorMessage = `레시피 삭제 실패: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("레시피 삭제 중 네트워크 오류가 발생했습니다.");
  }
};

