import React from "react";
import InfoIngredientSection from "./ingredientBox/ingredientSection";
import InfoIconBoxEach from "./iconBox/iconBoxEach";
import InfoStepBox from "./stepBox/stepBox";
import { useConfig } from "../../../Context/configContext";
import { useRecipeContext } from "../../../Context/recipeContext";

const InfoElement = () => {
    const {serverUrl} = useConfig();
    const {recipeIngres, recipeSteps, selectedRecipeUrl} = useRecipeContext();
    
    return(
        <div className="infoContainer">
            <div className="infoLeft">
                <img className="infoMainImg" src={`${serverUrl}${selectedRecipeUrl}`}/>
                <InfoStepBox recipeSteps={recipeSteps}/>
            </div>
            <div className="infoRight">
                <div className="ingredientBox">
                    <InfoIngredientSection sectionText="기본 재료" recipeIngres={recipeIngres}/>
                </div>
                <div className="iconBox">
                    <InfoIconBoxEach infoIconImg={`${serverUrl}/Image/RecipeImage/InfoImg/timer.png`} infoIconText="25분"/>
                    <InfoIconBoxEach infoIconImg={`${serverUrl}/Image/RecipeImage/InfoImg/people.png`} infoIconText="2인분"/>
                    <InfoIconBoxEach infoIconImg={`${serverUrl}/Image/RecipeImage/InfoImg/level.png`} infoIconText="쉬움"/>
                </div>
            </div>
        </div>
    )
}

export default InfoElement;