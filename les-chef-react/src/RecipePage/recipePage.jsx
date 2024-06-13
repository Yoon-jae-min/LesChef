import React, { useState } from "react";
import "./recipePage.css";
import RecipeBgImg from "../Image/RecipeImage/Background/recipeBackground.jpg";
import RecipeShowBox from "./recipeShowBox";
import RecipeMenuBox from "./recipeMenuBox";

const RecipePage = () => {
    const [category, setCategory] = useState('korean');

    return(
        <div className="recipeBody">
            <img src={RecipeBgImg} className="recipeBgImg"/>
            <RecipeMenuBox/>
            <RecipeShowBox/>
        </div>
    )
}

export default RecipePage;