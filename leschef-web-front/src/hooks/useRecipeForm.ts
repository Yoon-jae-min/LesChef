/**
 * 레시피 폼 상태 관리 커스텀 훅
 * 레시피 작성/수정 페이지에서 공통으로 사용하는 상태 관리 로직
 */

import { useState, useCallback } from "react";
import type { Ingredient, IngredientGroup, RecipeStep } from "@/utils/api/recipeApi";
import { RECIPE_DEFAULTS } from "@/constants/recipe/recipe";

export type RecipeFormState = {
  recipeName: string;
  cookTime: number;
  portion: number;
  portionUnit: string;
  cookLevel: string;
  majorCategory: string;
  subCategory: string;
  recipeImg: File | null;
  recipeImgPreview: string;
  ingredientGroups: IngredientGroup[];
  steps: RecipeStep[];
};

const INITIAL_STATE: RecipeFormState = {
  recipeName: "",
  cookTime: RECIPE_DEFAULTS.COOK_TIME,
  portion: RECIPE_DEFAULTS.PORTION,
  portionUnit: RECIPE_DEFAULTS.PORTION_UNIT,
  cookLevel: RECIPE_DEFAULTS.COOK_LEVEL,
  majorCategory: RECIPE_DEFAULTS.MAJOR_CATEGORY,
  subCategory: "",
  recipeImg: null,
  recipeImgPreview: "",
  ingredientGroups: [
    {
      sortType: RECIPE_DEFAULTS.INGREDIENT_GROUP_TYPE,
      ingredients: [
        {
          ingredientName: "",
          volume: 0,
          unit: RECIPE_DEFAULTS.INGREDIENT_UNIT,
        },
      ],
    },
  ],
  steps: [
    {
      stepNum: 1,
      stepWay: "",
      stepImg: "",
      stepImgFile: null,
    },
  ],
};

export function useRecipeForm(initialState?: Partial<RecipeFormState>) {
  const [formState, setFormState] = useState<RecipeFormState>({
    ...INITIAL_STATE,
    ...initialState,
  });

  // 기본 필드 업데이트
  const updateField = useCallback(<K extends keyof RecipeFormState>(
    field: K,
    value: RecipeFormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  }, []);

  // 이미지 변경 핸들러
  const handleImageChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    type: "main" | "step",
    stepIndex?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "main") {
      updateField("recipeImg", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField("recipeImgPreview", reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (stepIndex !== undefined) {
      const newSteps = [...formState.steps];
      newSteps[stepIndex].stepImgFile = file;
      const reader = new FileReader();
      reader.onloadend = () => {
        newSteps[stepIndex].stepImg = reader.result as string;
        setFormState((prev) => ({ ...prev, steps: newSteps }));
      };
      reader.readAsDataURL(file);
    }
  }, [formState.steps, updateField]);

  // 재료 그룹 추가
  const addIngredientGroup = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      ingredientGroups: [
        ...prev.ingredientGroups,
        {
          sortType: "",
          ingredients: [
            {
              ingredientName: "",
              volume: 0,
              unit: RECIPE_DEFAULTS.INGREDIENT_UNIT,
            },
          ],
        },
      ],
    }));
  }, []);

  // 재료 추가
  const addIngredient = useCallback((groupIndex: number) => {
    setFormState((prev) => {
      const newGroups = [...prev.ingredientGroups];
      newGroups[groupIndex].ingredients.push({
        ingredientName: "",
        volume: 0,
        unit: RECIPE_DEFAULTS.INGREDIENT_UNIT,
      });
      return { ...prev, ingredientGroups: newGroups };
    });
  }, []);

  // 재료 제거
  const removeIngredient = useCallback((groupIndex: number, ingredientIndex: number) => {
    setFormState((prev) => {
      const newGroups = [...prev.ingredientGroups];
      newGroups[groupIndex].ingredients.splice(ingredientIndex, 1);
      if (newGroups[groupIndex].ingredients.length === 0) {
        newGroups.splice(groupIndex, 1);
      }
      return { ...prev, ingredientGroups: newGroups };
    });
  }, []);

  // 재료 그룹 필드 업데이트
  const updateIngredientGroup = useCallback((
    groupIndex: number,
    field: "sortType" | "ingredients",
    value: string | Ingredient[]
  ) => {
    setFormState((prev) => {
      const newGroups = [...prev.ingredientGroups];
      if (field === "sortType") {
        newGroups[groupIndex].sortType = value as string;
      } else {
        newGroups[groupIndex].ingredients = value as Ingredient[];
      }
      return { ...prev, ingredientGroups: newGroups };
    });
  }, []);

  // 재료 필드 업데이트
  const updateIngredient = useCallback((
    groupIndex: number,
    ingredientIndex: number,
    field: keyof Ingredient,
    value: string | number
  ) => {
    setFormState((prev) => {
      const newGroups = [...prev.ingredientGroups];
      newGroups[groupIndex].ingredients[ingredientIndex][field] = value as never;
      return { ...prev, ingredientGroups: newGroups };
    });
  }, []);

  // 조리 단계 추가
  const addStep = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          stepNum: prev.steps.length + 1,
          stepWay: "",
          stepImg: "",
          stepImgFile: null,
        },
      ],
    }));
  }, []);

  // 조리 단계 제거
  const removeStep = useCallback((index: number) => {
    setFormState((prev) => {
      if (prev.steps.length <= 1) return prev;
      const newSteps = prev.steps
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, stepNum: i + 1 }));
      return { ...prev, steps: newSteps };
    });
  }, []);

  // 조리 단계 필드 업데이트
  const updateStep = useCallback((
    index: number,
    field: keyof RecipeStep,
    value: string | number | File | null
  ) => {
    setFormState((prev) => {
      const newSteps = [...prev.steps];
      newSteps[index][field] = value as never;
      return { ...prev, steps: newSteps };
    });
  }, []);

  // 폼 검증
  const validateRecipe = useCallback((): { isValid: boolean; errorMessage: string } => {
    const { RECIPE_VALIDATION_MESSAGES } = require("@/constants/recipe/recipe");
    
    // 1. 레시피 이름 필수
    if (!formState.recipeName || formState.recipeName.trim().length === 0) {
      return {
        isValid: false,
        errorMessage: RECIPE_VALIDATION_MESSAGES.NAME_REQUIRED,
      };
    }

    // 2. 재료 1개 이상 필수
    const hasValidIngredient = formState.ingredientGroups.some(
      (group) => group.ingredients.some(
        (ingredient) => ingredient.ingredientName && ingredient.ingredientName.trim().length > 0
      )
    );
    if (!hasValidIngredient) {
      return {
        isValid: false,
        errorMessage: RECIPE_VALIDATION_MESSAGES.INGREDIENT_REQUIRED,
      };
    }

    // 3. 조리 단계 1개 이상 필수
    const hasValidStep = formState.steps.some(
      (step) => step.stepWay && step.stepWay.trim().length > 0
    );
    if (!hasValidStep) {
      return {
        isValid: false,
        errorMessage: RECIPE_VALIDATION_MESSAGES.STEP_REQUIRED,
      };
    }

    return { isValid: true, errorMessage: "" };
  }, [formState]);

  // 폼 초기화
  const resetForm = useCallback(() => {
    setFormState(INITIAL_STATE);
  }, []);

  return {
    formState,
    updateField,
    handleImageChange,
    addIngredientGroup,
    addIngredient,
    removeIngredient,
    updateIngredientGroup,
    updateIngredient,
    addStep,
    removeStep,
    updateStep,
    validateRecipe,
    resetForm,
  };
}

