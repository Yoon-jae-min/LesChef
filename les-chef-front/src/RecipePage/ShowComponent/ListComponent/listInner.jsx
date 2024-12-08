import React from "react";

const RecipeElement = (props) => {
    const {setInfoGoto} = props;

    const handleClick = () => {
        setInfoGoto(true);
    }

    return(
        <div className="recipeElement" onClick={handleClick}>
            <img className="elementImg" src="/Image/RecipeImage/ListImg/참치김치찌개.jpg"/>
            <div className="elementInfoBox">
                <p className="listRecipeTitle">참치김치찌개</p>
                <div className="starBox"></div>
                <div className="showCountBox"></div>
            </div>
        </div>
    )
}

export default RecipeElement;