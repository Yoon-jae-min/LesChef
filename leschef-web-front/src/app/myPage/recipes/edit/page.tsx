"use client";

// 동적 렌더링 강제 (useSearchParams 이슈 방지)
export const dynamic = "force-dynamic";

import Top from "@/components/common/navigation/Top";
import { useEffect, useState } from "react";
import { fetchRecipeForEdit, updateRecipe } from "@/utils/api/recipeApi";
import { assertApiJsonSuccess } from "@/utils/helpers/apiJsonResponse";
import { recipeSubCategoryForApi } from "@/constants/recipe/recipe";
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
          subCategory: recipeSubCategoryForApi(formState.subCategory),
          // 새 파일을 올리는 경우 preview(data URL)를 보내면 백엔드 업로드가 스킵될 수 있음
          recipeImg: formState.recipeImg ? "" : formState.recipeImgPreview || "",
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
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <header className="mb-8 rounded-[28px] border border-stone-200/90 bg-white/95 px-5 py-5 shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/[0.03] sm:px-6 sm:py-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-600/90">
            Recipe
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            레시피 수정
          </h1>
          <p className="mt-1.5 text-sm text-stone-600">레시피 정보를 수정해 보세요.</p>
        </header>

        {!loadReady ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-sm text-stone-600">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-orange-500"
              aria-hidden
            />
            <p role="status" aria-live="polite">
              레시피를 불러오는 중입니다…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
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

            <div className="flex flex-col-reverse gap-3 border-t border-stone-200/80 pt-8 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.history.back();
                  }
                }}
                className="rounded-2xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2"
              >
                취소
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
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
