import React, { createContext, useContext, useState } from "react";

const RecipeContext = createContext();

export const RecipeProvider = ({children}) => {
    const [recipeList, setRecipeList] = useState([]);
    const [recipeIngres, setRecipeIngres] = useState([]);
    const [recipeSteps, setRecipeSteps] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    return(
        <RecipeContext.Provider 
            value={{recipeList, setRecipeList, 
                    recipeIngres, setRecipeIngres, 
                    recipeSteps, setRecipeSteps, 
                    selectedRecipe, setSelectedRecipe}}>
            {children}
        </RecipeContext.Provider>
    )
}

export const useRecipeContext = () => useContext(RecipeContext);