import React from "react";
import elementImg from "../../../Image/RecipeImage/elementImg/참치김치찌개.jpg";

const RecipeElement = (props) => {
    const {setInfoGoto} = props;

    const handleClick = () => {
        setInfoGoto(true);
    }

    return(
        <div className="recipeElement" onClick={handleClick}>
            <img className="elementImg" src={elementImg}/>
            <div className="elementInfoBox">
                <p className="listRecipeTitle">참치김치찌개</p>
                <div className="starBox"></div>
                <div className="showCountBox"></div>
            </div>
        </div>
    )
}

export default RecipeElement;