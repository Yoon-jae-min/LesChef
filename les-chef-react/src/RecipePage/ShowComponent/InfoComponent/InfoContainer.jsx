import React from "react";
import elementImg from "../../../Image/RecipeImage/ListImg/참치김치찌개.jpg";

const InfoElement = () => {
    return(
        <div className="infoContainer">
            <img className="infoMainImg" src={elementImg}/>
            <div className="ingredientBox"></div>
            <div className="iconBox"></div>
        </div>
    )
}

export default InfoElement;