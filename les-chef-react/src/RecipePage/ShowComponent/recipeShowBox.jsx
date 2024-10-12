import React, { useEffect, useState } from "react";
import RecipeShowHead from "./recipeShowHeader";
import RecipeShowGpBox from "./ListComponent/recipeShowGpBox";
import ElementContainer from "./ListComponent/recipeElementContainer";
import InfoElement from "./InfoComponent/recipeInfoElement";
import "./ListComponent/listComponent.css";
import "./InfoComponent/infoComponent.css";

const RecipeShowBox = (props) => {
    const {category, infoGoto, setInfoGoto} = props;

    return(
        <div className="recipeShowBox">
            <RecipeShowHead category={category}/>
            <RecipeShowGpBox category={category} infoGoto={infoGoto}/>
            <hr/>
            { !infoGoto && <ElementContainer setInfoGoto={setInfoGoto}/> }
            { infoGoto && <InfoElement/> }
            <hr/>
        </div>
    )
}

export default RecipeShowBox;