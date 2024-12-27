//기타
import React from "react";

//컨텍스트
import { useConfig } from "../../../Context/configContext";
import { useRecipeContext } from "../../../Context/recipeContext";

//컴포넌트
import InfoIngredientSection from "./ingredientBox/ingredientSection";
import InfoIconBoxEach from "./iconBox/iconBoxEach";
import InfoStepBox from "./stepBox/stepBox";

const InfoElement = () => {
    const {serverUrl} = useConfig();
    const { recipeIngres, 
            recipeSteps, 
            selectedRecipe} = useRecipeContext();
    
    return(
        <div className="infoContainer">
            <div className="infoLeft">
                <img className="infoMainImg" src={`${serverUrl}${selectedRecipe.recipeImg}`}/>
                <InfoStepBox 
                    recipeSteps={recipeSteps}/>
            </div>
            <div className="infoRight">
                <div className="ingredientBox">
                    <InfoIngredientSection 
                        recipeIngres={recipeIngres}/>
                </div>
                <div className="iconBox">
                    <InfoIconBoxEach 
                        infoIconImg={`${serverUrl}/Image/RecipeImage/InfoImg/timer.png`} 
                        infoIconText={`${selectedRecipe.cookTime}분`}/>
                    <InfoIconBoxEach 
                        infoIconImg={`${serverUrl}/Image/RecipeImage/InfoImg/people.png`} 
                        infoIconText={`${selectedRecipe.portion}${selectedRecipe.portionUnit}`}/>
                    <InfoIconBoxEach 
                        infoIconImg={`${serverUrl}/Image/RecipeImage/InfoImg/level.png`} 
                        infoIconText={`${selectedRecipe.cookLevel}`}/>
                </div>
            </div>
        </div>
    )
}

export default InfoElement;