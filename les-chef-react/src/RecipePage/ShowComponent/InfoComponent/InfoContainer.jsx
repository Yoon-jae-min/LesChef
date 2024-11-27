import React from "react";
import InfoIngredientSection from "./ingredientBox/infoIngredientSection";
import InfoIcon from "./iconBox/infoIcon";
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
                    <InfoIcon/>
                </div>
            </div>
        </div>
    )
}

export default InfoElement;