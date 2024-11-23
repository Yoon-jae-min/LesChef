import React from "react";
import elementImg from "../../../Image/RecipeImage/ListImg/참치김치찌개.jpg";
import InfoStepEven from "./infoStepEven";
import InfoStepOdd from "./infoStepOdd";

const InfoElement = () => {
    return(
        <div className="infoContainer">
            <div className="infoLeft">
                <img className="infoMainImg" src={elementImg}/>
                <InfoStepOdd/>
                <InfoStepEven/>
            </div>
            <div className="infoRight">
                <div className="ingredientBox"></div>
                <div className="iconBox"></div>
            </div>
        </div>
    )
}

export default InfoElement;