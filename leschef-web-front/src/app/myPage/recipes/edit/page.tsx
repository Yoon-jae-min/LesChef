"use client";

import Top from "@/components/common/top";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Ingredient = {
  ingredientName: string;
  volume: number;
  unit: string;
};

type IngredientGroup = {
  sortType: string;
  ingredients: Ingredient[];
};

type RecipeStep = {
  stepNum: number;
  stepWay: string;
  stepImg: string;
  stepImgFile?: File | null;
};

export default function RecipeEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recipeId = searchParams.get("id");

  const [recipeName, setRecipeName] = useState("");
  const [cookTime, setCookTime] = useState(30);
  const [portion, setPortion] = useState(2);
  const [portionUnit, setPortionUnit] = useState("인분");
  const [cookLevel, setCookLevel] = useState("쉬움");
  const [majorCategory, setMajorCategory] = useState("한식");
  const [subCategory, setSubCategory] = useState("");
  const [recipeImg, setRecipeImg] = useState<File | null>(null);
  const [recipeImgPreview, setRecipeImgPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const [ingredientGroups, setIngredientGroups] = useState<IngredientGroup[]>([
    { sortType: "주재료", ingredients: [{ ingredientName: "", volume: 0, unit: "개" }] },
  ]);

  const [steps, setSteps] = useState<RecipeStep[]>([
    { stepNum: 1, stepWay: "", stepImg: "", stepImgFile: null },
  ]);

  // 기존 레시피 데이터 불러오기
  useEffect(() => {
    if (!recipeId) {
      router.push("/myPage/recipes");
      return;
    }

    // TODO: API 연동 - 실제 서버에서 레시피 데이터 가져오기
    // 현재는 mock 데이터 사용
    const loadRecipeData = async () => {
      setIsLoading(true);
      try {
        // const response = await fetch(`/api/recipes/${recipeId}`);
        // const data = await response.json();
        
        // Mock 데이터
        const mockData = {
          recipeName: "김치볶음밥",
          cookTime: 20,
          portion: 2,
          portionUnit: "인분",
          cookLevel: "쉬움",
          majorCategory: "한식",
          subCategory: "볶음",
          recipeImg: "",
          ingredientGroups: [
            {
              sortType: "주재료",
              ingredients: [
                { ingredientName: "밥", volume: 2, unit: "공기" },
                { ingredientName: "김치", volume: 100, unit: "g" },
              ],
            },
            {
              sortType: "양념",
              ingredients: [
                { ingredientName: "고춧가루", volume: 1, unit: "큰술" },
              ],
            },
          ],
          steps: [
            { stepNum: 1, stepWay: "팬에 기름을 두르고 김치를 볶습니다.", stepImg: "" },
            { stepNum: 2, stepWay: "밥을 넣고 볶아줍니다.", stepImg: "" },
            { stepNum: 3, stepWay: "계란을 넣고 마무리합니다.", stepImg: "" },
          ],
        };

        setRecipeName(mockData.recipeName);
        setCookTime(mockData.cookTime);
        setPortion(mockData.portion);
        setPortionUnit(mockData.portionUnit);
        setCookLevel(mockData.cookLevel);
        setMajorCategory(mockData.majorCategory);
        setSubCategory(mockData.subCategory);
        setIngredientGroups(mockData.ingredientGroups);
        setSteps(mockData.steps.map((step, idx) => ({
          ...step,
          stepImgFile: null,
        })));
      } catch (error) {
        console.error("레시피 데이터 로드 실패:", error);
        alert("레시피를 불러오는데 실패했습니다.");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipeData();
  }, [recipeId, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: "main" | "step", stepIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "main") {
      setRecipeImg(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setRecipeImgPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (stepIndex !== undefined) {
      const newSteps = [...steps];
      newSteps[stepIndex].stepImgFile = file;
      const reader = new FileReader();
      reader.onloadend = () => {
        newSteps[stepIndex].stepImg = reader.result as string;
        setSteps(newSteps);
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredientGroup = () => {
    setIngredientGroups([...ingredientGroups, { sortType: "", ingredients: [{ ingredientName: "", volume: 0, unit: "개" }] }]);
  };

  const addIngredient = (groupIndex: number) => {
    const newGroups = [...ingredientGroups];
    newGroups[groupIndex].ingredients.push({ ingredientName: "", volume: 0, unit: "개" });
    setIngredientGroups(newGroups);
  };

  const removeIngredient = (groupIndex: number, ingredientIndex: number) => {
    const newGroups = [...ingredientGroups];
    newGroups[groupIndex].ingredients.splice(ingredientIndex, 1);
    if (newGroups[groupIndex].ingredients.length === 0) {
      newGroups.splice(groupIndex, 1);
    }
    setIngredientGroups(newGroups);
  };

  const addStep = () => {
    setSteps([...steps, { stepNum: steps.length + 1, stepWay: "", stepImg: "", stepImgFile: null }]);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index).map((step, i) => ({ ...step, stepNum: i + 1 }));
      setSteps(newSteps);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연동
    console.log("레시피 수정:", { recipeId, recipeName, cookTime, portion, portionUnit, cookLevel, majorCategory, subCategory, ingredientGroups, steps });
    alert("레시피 수정 기능은 서버 연동 후 구현됩니다.");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Top />
        <main className="max-w-4xl mx-auto px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">레시피를 불러오는 중...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-8 py-12">
        <div className="mb-8 rounded-[32px] border border-gray-200 bg-white px-6 py-5 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-gray-400">Recipe Edit</p>
          <h1 className="text-2xl font-semibold text-gray-900 mt-1">레시피 수정</h1>
          <p className="text-xs text-gray-500 mt-1">레시피 정보를 수정해보세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 기본 정보 */}
          <section className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">기본 정보</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">레시피 이름</label>
                <input
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  placeholder="예) 김치볶음밥"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">조리 시간 (분)</label>
                  <input
                    type="number"
                    value={cookTime}
                    onChange={(e) => setCookTime(Number(e.target.value))}
                    min={1}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-gray-400 focus:ring-0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">난이도</label>
                  <select
                    value={cookLevel}
                    onChange={(e) => setCookLevel(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-gray-400 focus:ring-0"
                  >
                    <option value="쉬움">쉬움</option>
                    <option value="보통">보통</option>
                    <option value="어려움">어려움</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">분량</label>
                  <input
                    type="number"
                    value={portion}
                    onChange={(e) => setPortion(Number(e.target.value))}
                    min={1}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-gray-400 focus:ring-0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">단위</label>
                  <select
                    value={portionUnit}
                    onChange={(e) => setPortionUnit(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-gray-400 focus:ring-0"
                  >
                    <option value="인분">인분</option>
                    <option value="그릇">그릇</option>
                    <option value="개">개</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                  <select
                    value={majorCategory}
                    onChange={(e) => setMajorCategory(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-gray-400 focus:ring-0"
                  >
                    <option value="한식">한식</option>
                    <option value="일식">일식</option>
                    <option value="중식">중식</option>
                    <option value="양식">양식</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">세부 카테고리</label>
                  <input
                    type="text"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    placeholder="예) 볶음, 찜, 구이"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">대표 이미지</label>
                <div className="space-y-3">
                  {recipeImgPreview ? (
                    <div className="relative w-full h-64 rounded-2xl border border-gray-200 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      <img src={recipeImgPreview} alt="레시피 미리보기" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="relative w-full h-64 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                        <span className="text-4xl">📷</span>
                        <span className="text-sm">이미지를 업로드하세요</span>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "main")}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-gray-400 focus:ring-0"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 재료 */}
          <section className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">재료</h2>
              <button
                type="button"
                onClick={addIngredientGroup}
                className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
              >
                재료 그룹 추가
              </button>
            </div>

            <div className="space-y-6">
              {ingredientGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="text"
                      value={group.sortType}
                      onChange={(e) => {
                        const newGroups = [...ingredientGroups];
                        newGroups[groupIndex].sortType = e.target.value;
                        setIngredientGroups(newGroups);
                      }}
                      placeholder="예) 주재료, 양념"
                      className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => addIngredient(groupIndex)}
                      className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-white transition"
                    >
                      재료 추가
                    </button>
                  </div>

                  <div className="space-y-3">
                    {group.ingredients.map((ingredient, ingredientIndex) => (
                      <div key={ingredientIndex} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={ingredient.ingredientName}
                          onChange={(e) => {
                            const newGroups = [...ingredientGroups];
                            newGroups[groupIndex].ingredients[ingredientIndex].ingredientName = e.target.value;
                            setIngredientGroups(newGroups);
                          }}
                          placeholder="재료명"
                          className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
                        />
                        <input
                          type="number"
                          value={ingredient.volume}
                          onChange={(e) => {
                            const newGroups = [...ingredientGroups];
                            newGroups[groupIndex].ingredients[ingredientIndex].volume = Number(e.target.value);
                            setIngredientGroups(newGroups);
                          }}
                          placeholder="수량"
                          min={0}
                          step={0.1}
                          className="w-24 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-gray-400 focus:ring-0"
                        />
                        <input
                          type="text"
                          value={ingredient.unit}
                          onChange={(e) => {
                            const newGroups = [...ingredientGroups];
                            newGroups[groupIndex].ingredients[ingredientIndex].unit = e.target.value;
                            setIngredientGroups(newGroups);
                          }}
                          placeholder="단위"
                          className="w-20 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
                        />
                        <button
                          type="button"
                          onClick={() => removeIngredient(groupIndex, ingredientIndex)}
                          className="rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 조리 단계 */}
          <section className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-[6px_6px_0_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">조리 단계</h2>
              <button
                type="button"
                onClick={addStep}
                className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
              >
                단계 추가
              </button>
            </div>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-white text-sm font-semibold">
                      {step.stepNum}
                    </span>
                    <h3 className="text-base font-semibold text-gray-900">단계 {step.stepNum}</h3>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="ml-auto rounded-xl border border-red-200 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                      >
                        삭제
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <textarea
                      value={step.stepWay}
                      onChange={(e) => {
                        const newSteps = [...steps];
                        newSteps[index].stepWay = e.target.value;
                        setSteps(newSteps);
                      }}
                      placeholder="조리 방법을 입력하세요..."
                      rows={4}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
                      required
                    />
                    <div>
                      {step.stepImg ? (
                        <div className="mb-2 relative w-full h-48 rounded-xl border border-gray-200 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                          <img src={step.stepImg} alt={`단계 ${step.stepNum}`} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="mb-2 relative w-full h-48 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                          <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                            <span className="text-3xl">📷</span>
                            <span className="text-xs">이미지를 업로드하세요</span>
                          </div>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "step", index)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-900 focus:border-gray-400 focus:ring-0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 제출 버튼 */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
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

