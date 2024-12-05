import React from "react";
import InfoIngredientSection from "./ingredientBox/infoIngredientSection";
import InfoIconBoxEach from "./iconBox/infoIconBoxEach";
import InfoStepBox from "./stepBox/infoStepBox";

const InfoElement = () => {
    return(
        <div className="infoContainer">
            <div className="infoLeft">
                <img className="infoMainImg" src="/Image/RecipeImage/ListImg/참치김치찌개.jpg"/>
                <InfoStepBox/>
            </div>
            <div className="infoRight">
                <div className="ingredientBox">
                    <InfoIngredientSection sectionText="기본 재료"/>
                </div>
                <div className="iconBox">
                    <InfoIconBoxEach infoIconImg="/Image/RecipeImage/InfoImg/timer.png" infoIconText="25분"/>
                    <InfoIconBoxEach infoIconImg="/Image/RecipeImage/InfoImg/people.png" infoIconText="2인분"/>
                    <InfoIconBoxEach infoIconImg="/Image/RecipeImage/InfoImg/level.png" infoIconText="쉬움"/>
                </div>
            </div>
        </div>
    )
}

export default InfoElement;