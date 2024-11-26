import React from "react";
import elementImg from "../../../Image/RecipeImage/ListImg/참치김치찌개.jpg";
import InfoIngredientSection from "./ingredientBox/infoIngredientSection";
import InfoIcon from "./iconBox/infoIcon";
import InfoStepBox from "./stepBox/infoStepBox";

const InfoElement = () => {
    return(
        <div className="infoContainer">
            <div className="infoLeft">
                <img className="infoMainImg" src={elementImg}/>
                <InfoStepBox/>
            </div>
            <div className="infoRight">
                <div className="ingredientBox">
                    <InfoIngredientSection/>
                </div>
                <div className="iconBox">
                    <InfoIcon/>
                </div>
            </div>
        </div>
    )
}

export default InfoElement;