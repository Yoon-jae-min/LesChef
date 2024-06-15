import React, { useEffect } from "react";
import RecipeShowHead from "./recipeShowHeader";

const RecipeShowBox = (props) => {
    const {category} = props;
    
    return(
        <div className="recipeShowBox">
            <RecipeShowHead category={category}/>
        </div>
    )
}

export default RecipeShowBox;