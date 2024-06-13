import React from "react";
import RecipeLogo from "../Image/RecipeImage/LogoWhite.png"
import RecipeMenuText from "./recipeMenuText";
import { Link } from "react-router-dom";

const RecipeMenuBox = () => {
    return(
        <div className="recipeMenuBox">
            <RecipeMenuText/>
            <Link to="/"><img className="recipeLogo" src={RecipeLogo}/></Link>
        </div>
    )
}

export default RecipeMenuBox