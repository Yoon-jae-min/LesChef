"use client";

// 동적 렌더링 강제 (useSearchParams 이슈 방지)
export const dynamic = "force-dynamic";

import Top from "@/components/common/navigation/Top";
import { useEffect, useState } from "react";
import { fetchRecipeForEdit, updateRecipe } from "@/utils/api/recipeApi";
import { assertApiJsonSuccess } from "@/utils/helpers/apiJsonResponse";
import { reportActionFailure } from "@/utils/helpers/actionFailure";
import { useRecipeForm } from "@/hooks/useRecipeForm";
import BasicInfo from "@/components/recipe/form/BasicInfo";
import Ingredient from "@/components/recipe/form/Ingredient";
import Step from "@/components/recipe/form/Step";

function RecipeEditPageContent() {
  const [recipeId, setRecipeId] = useState<string | null>(null);
  const [loadReady, setLoadReady] = useState(false);

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
    hydrateFromDetail,
  } = useRecipeForm();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) {
      window.location.href = "/myPage/recipes";
      return;
    }

    setRecipeId(id);
    let cancelled = false;

    (async () => {
      setLoadReady(false);
      try {
        const data = await fetchRecipeForEdit(id);
        if (cancelled) return;
        hydrateFromDetail(data);
        setLoadReady(true);
      } catch (error) {
        if (cancelled) return;
        if (process.env.NODE_ENV === "development") {
          console.error("레시피 로드 실패:", error);
        }
        reportActionFailure(error, { redirect: "/myPage/recipes" });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrateFromDetail]);

  const handleUpdateRecipe = async () => {
    if (!recipeId) {
      alert("레시피 ID가 없습니다.");
      return;
    }

    const validation = validateRecipe();
    if (!validation.isValid) {
      alert(validation.errorMessage);
      return;
    }

    try {
      const response = await updateRecipe({
        recipeInfo: {
          recipeName: formState.recipeName,
          cookTime: formState.cookTime,
          portion: formState.portion,
          portionUnit: formState.portionUnit,
          cookLevel: formState.cookLevel,
          majorCategory: formState.majorCategory,
          subCategory: formState.subCategory,
          recipeImg: formState.recipeImgPreview || "",
          _id: recipeId,
        },
        ingredientGroups: formState.ingredientGroups,
        steps: formState.steps,
        recipeImgFile: formState.recipeImg,
        recipeId: recipeId,
      });

      await assertApiJsonSuccess(response, "success");
      if (typeof window !== "undefined" && recipeId) {
        window.location.href = `/recipe/detail?id=${recipeId}`;
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("레시피 수정 실패:", error);
      }
      reportActionFailure(error, { redirect: "back" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleUpdateRecipe();
  };

  return (
    <div className="min-h-screen bg-white">
      <Top />
      <main className="max-w-4xl mx-auto px-8 py-12">
        <div className="mb-8 rounded-[32px] border border-gray-200 bg-white px-6 py-5 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-gray-400">
            Recipe Edit
          </p>
          <h1 className="text-2xl font-semibold text-gray-900 mt-1">레시피 수정</h1>
          <p className="text-xs text-gray-500 mt-1">레시피 정보를 수정해보세요.</p>
        </div>

        {!loadReady ? (
          <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
            레시피를 불러오는 중입니다…
          </div>
        ) : (
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
                className="rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
              >
                취소
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-gray-700 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition"
              >
                수정 완료
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default function RecipeEditPage() {
  return <RecipeEditPageContent />;
}
