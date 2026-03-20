"use client";

import BasicInfo from "@/components/recipe/form/BasicInfo";
import Ingredient from "@/components/recipe/form/Ingredient";
import Step from "@/components/recipe/form/Step";
import { useRecipeForm } from "@/hooks/useRecipeForm";
import { createRecipe } from "@/utils/api/recipeApi";
import { reportActionFailure } from "@/utils/helpers/actionFailure";
import { assertApiJsonSuccess } from "@/utils/helpers/apiJsonResponse";

/**
 * 레시피 작성 (클라이언트 페이지)
 * 상단 네비는 `myPage/layout` 등 상위 레이아웃에서 처리합니다.
 */
export default function RecipeWritePage() {
  const {
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
  } = useRecipeForm();

  const handleSubmitRecipe = async () => {
    const validation = validateRecipe();
    if (!validation.isValid) {
      alert(validation.errorMessage);
      return;
    }

    try {
      const response = await createRecipe({
        recipeInfo: {
          recipeName: formState.recipeName,
          cookTime: formState.cookTime,
          portion: formState.portion,
          portionUnit: formState.portionUnit,
          cookLevel: formState.cookLevel,
          majorCategory: formState.majorCategory,
          subCategory: formState.subCategory,
          recipeImg: formState.recipeImgPreview || "",
        },
        ingredientGroups: formState.ingredientGroups,
        steps: formState.steps,
        recipeImgFile: formState.recipeImg,
      });

      await assertApiJsonSuccess(response, "success");
      if (typeof window !== "undefined") {
        window.location.href = "/myPage/recipes";
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("레시피 작성 실패:", error);
      }
      reportActionFailure(error, { redirect: "back" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmitRecipe();
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-4xl px-8 py-12">
        <div className="mb-8 rounded-[32px] border border-gray-200 bg-white px-6 py-5 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-gray-400">
            Recipe Write
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-900">레시피 작성</h1>
          <p className="mt-1 text-xs text-gray-500">나만의 레시피를 공유해보세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <BasicInfo
            recipeName={formState.recipeName}
            cookTime={formState.cookTime}
            portion={formState.portion}
            portionUnit={formState.portionUnit}
            cookLevel={formState.cookLevel}
            majorCategory={formState.majorCategory}
            subCategory={formState.subCategory}
            recipeImgPreview={formState.recipeImgPreview}
            onRecipeNameChange={(value) => updateField("recipeName", value)}
            onCookTimeChange={(value) => updateField("cookTime", value)}
            onPortionChange={(value) => updateField("portion", value)}
            onPortionUnitChange={(value) => updateField("portionUnit", value)}
            onCookLevelChange={(value) => updateField("cookLevel", value)}
            onMajorCategoryChange={(value) => updateField("majorCategory", value)}
            onSubCategoryChange={(value) => updateField("subCategory", value)}
            onImageChange={(e) => handleImageChange(e, "main")}
          />

          <Ingredient
            ingredientGroups={formState.ingredientGroups}
            onAddGroup={addIngredientGroup}
            onAddIngredient={addIngredient}
            onRemoveIngredient={removeIngredient}
            onUpdateGroupType={(groupIndex, sortType) =>
              updateIngredientGroup(groupIndex, "sortType", sortType)
            }
            onUpdateIngredient={updateIngredient}
          />

          <Step
            steps={formState.steps}
            onAddStep={addStep}
            onRemoveStep={removeStep}
            onUpdateStep={(index, field, value) => updateStep(index, field, value)}
            onImageChange={(e, stepIndex) => handleImageChange(e, "step", stepIndex)}
          />

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.history.back();
                }
              }}
              className="rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-gray-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              레시피 등록
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
