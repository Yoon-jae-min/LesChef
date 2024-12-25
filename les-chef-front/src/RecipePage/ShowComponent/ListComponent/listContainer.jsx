import React, { useEffect, useState } from "react";
import ListElement from "./listInner";
import { useRecipeContext } from "../../../Context/recipeContext";

const ElementContainer = (props) => {
    const {setInfoGoto} = props;
    const {recipeList} = useRecipeContext();

    return(
        <div className="elementContainer">
            {recipeList.map((recipe, index) => {
                return (<ListElement 
                    key={index} 
                    setInfoGoto={setInfoGoto} 
                    recipeImg={recipe.recipeImg}
                    recipeName={recipe.recipeName}/>
                );
            })}
        </div>
    )
}

export default ElementContainer;