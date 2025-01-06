//기타
import React from "react";

//컨텍스트
import { useConfig } from "../../../../Context/configContext";
import { useRecipeContext } from "../../../../Context/recipeContext";

//컴포넌트
import InfoStepEach from "./infoStepEach";
import IngredientSection from "./ingredientSection";
import IconEach from "./iconEach";


const InfoBox = () => {
    const {serverUrl} = useConfig();
    const { recipeIngres, 
            recipeSteps, 
            selectedRecipe } = useRecipeContext();

    return(
        <>
            <div className="customerRecipeLeft">
                <img className="customerRecipeMainImg" src={`${serverUrl}${selectedRecipe.recipeImg}`}/>
                <div className="customerRecipeStepBox">
                    {recipeSteps.map((step, index) => {
                        return(
                            <InfoStepEach
                                key={index}
                                imageSrc={`${serverUrl}${step.stepImg}`}
                                stepNum={step.stepNum}
                                stepText={step.stepWay}
                            />
                        )
                    })}
                </div>
            </div>
            <div className="customerRecipeRight">
                <div className="customerRecipeIngredientBox">
                    <IngredientSection 
                        recipeIngres={recipeIngres}/>
                </div>
                <div className="customerRecipeIconBox">
                    <IconEach 
                        infoIconImg={`${serverUrl}/Image/RecipeImage/InfoImg/timer.png`} 
                        infoIconText={`${selectedRecipe.cookTime}분`}/>
                    <IconEach 
                        infoIconImg={`${serverUrl}/Image/RecipeImage/InfoImg/people.png`} 
                        infoIconText={`${selectedRecipe.portion}${selectedRecipe.portionUnit}`}/>
                    <IconEach 
                        infoIconImg={`${serverUrl}/Image/RecipeImage/InfoImg/level.png`} 
                        infoIconText={`${selectedRecipe.cookLevel}`}/>
                </div>
            </div>
        </>
    )
}

export default InfoBox;