"use client";

// 동적 렌더링 강제 (useSearchParams 이슈 방지)
export const dynamic = 'force-dynamic';

import Top from "@/components/common/navigation/Top";
import { useEffect, useState } from "react";
import { updateRecipe } from "@/utils/api/recipeApi";
import { useRecipeForm } from "@/hooks/useRecipeForm";
import BasicInfo from "@/components/recipe/form/BasicInfo";
import Ingredient from "@/components/recipe/form/Ingredient";
import Step from "@/components/recipe/form/Step";

function RecipeEditPageContent() {
  const [recipeId, setRecipeId] = useState<string | null>(null);
  const [deletedStepImages, setDeletedStepImages] = useState<string[]>([]);

  // URL에서 recipeId 가져오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      setRecipeId(id);
    }
  }, []);

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

  // 기존 레시피 데이터 불러오기 (추후 구현 필요)
  useEffect(() => {
    if (!recipeId) {
      if (typeof window !== 'undefined') {
        window.location.href = "/myPage/recipes";
      }
      return;
    }
    // TODO: recipeId로 레시피 데이터를 가져와서 formState 초기화
    // const loadRecipe = async () => {
    //   try {
    //     const recipeData = await fetchRecipeById(recipeId);
    //     // formState 업데이트
    //   } catch (error) {
    //     console.error("레시피 로드 실패:", error);
    //   }
    // };
    // loadRecipe();
  }, [recipeId]);

  // 레시피 수정 함수
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
      const deleteImgs: string[] = [...deletedStepImages];

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
        deleteImgs: deleteImgs.length > 0 ? deleteImgs : undefined,
      });

      if (response.ok) {
        const result = await response.text();
        if (result === "success") {
          if (typeof window !== 'undefined' && recipeId) {
            window.location.href = `/recipe/detail?id=${recipeId}`;
          }
        } else {
          throw new Error("서버 응답 오류");
        }
      } else {
        throw new Error(`서버 오류: ${response.status}`);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("레시피 수정 실패:", error);
      }
      alert("레시피 수정에 실패했습니다. 다시 시도해주세요.");
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
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-gray-400">Recipe Edit</p>
          <h1 className="text-2xl font-semibold text-gray-900 mt-1">레시피 수정</h1>
          <p className="text-xs text-gray-500 mt-1">레시피 정보를 수정해보세요.</p>
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

          {/* 제출 버튼 */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
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
      </main>
    </div>
  );
}

export default function RecipeEditPage() {
  return <RecipeEditPageContent />;
}
