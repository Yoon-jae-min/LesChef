import React from "react";
import RecipeShowHead from "./recipeShowHeader";
import RecipeShowGpBox from "./ListComponent/recipeShowGpBox";
import ElementContainer from "./ListComponent/recipeElementContainer";
import "./ListComponent/listComponent.css";

const RecipeShowBox = (props) => {
    const {category} = props;
    
    return(
        <div className="recipeShowBox">
            <RecipeShowHead category={category}/>
            <RecipeShowGpBox category={category}/>
            <hr/>
            <ElementContainer/>
            <hr/>
        </div>
    )
}

export default RecipeShowBox;