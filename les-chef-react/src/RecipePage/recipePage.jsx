import React from "react";
import "./recipePage.css";
import ListMainHeader from "./recipeMainHeader";
import RecipeNav from "./recipeNavigation";
import ListContainer from "./recipeListContainer";

const RecipePage = () => {
    return(
        <div>
            <ListMainHeader/>
            <RecipeNav/>
            <ListContainer/>
        </div>
    )
}

export default RecipePage;