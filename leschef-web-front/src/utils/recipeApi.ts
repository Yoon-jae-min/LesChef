/**
 * 레시피 API 유틸리티 함수
 * 서버로 레시피 데이터를 전송하는 함수들
 */

// 예시 API 주소 (나중에 실제 주소로 변경)
const API_BASE_URL = "http://localhost:3000/api/recipe";

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

/**
 * 재료 데이터를 백엔드 형식으로 변환
 */
const transformIngredients = (
  ingredientGroups: IngredientGroup[],
  recipeId: string
): any[] => {
  return ingredientGroups.map((group) => ({
    recipeId: recipeId,
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
const transformSteps = (steps: RecipeStep[], recipeId: string): any[] => {
  return steps.map((step) => ({
    recipeId: recipeId,
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

  // 재료 데이터 변환 및 추가
  // edit 모드가 아닐 때는 임시 recipeId 사용 (서버에서 생성된 ID로 교체됨)
  const tempRecipeId = isEdit && recipeId ? recipeId : "temp";
  const transformedIngredients = transformIngredients(ingredientGroups, tempRecipeId);
  formData.append("recipeIngredients", JSON.stringify(transformedIngredients));

  // 조리 단계 데이터 변환 및 추가
  const transformedSteps = transformSteps(steps, tempRecipeId);
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
  const response = await fetch(`${API_BASE_URL}/write`, {
    method: "POST",
    body: formData,
    // FormData를 사용할 때는 Content-Type을 설정하지 않음 (브라우저가 자동으로 설정)
    credentials: "include", // 세션 쿠키를 포함하기 위해
  });

  return response;
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

