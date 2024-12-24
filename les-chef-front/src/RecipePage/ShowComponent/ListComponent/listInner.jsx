import React from "react";
import { useConfig } from "../../../Context/configContext";

const RecipeElement = (props) => {
    const {setInfoGoto} = props;
    const {serverUrl} = useConfig();

    const handleClick = () => {
        setInfoGoto(true);
    }

    return(
        <div className="recipeElement" onClick={handleClick}>
            <img className="elementImg" src={`${serverUrl}/Image/RecipeImage/ListImg/tuna_kimchi_soup.jpg`}/>
            <div className="elementInfoBox">
                <p className="listRecipeTitle">참치김치찌개</p>
                <div className="starBox"></div>
                <div className="showCountBox"></div>
            </div>
        </div>
    )
}

export default RecipeElement;