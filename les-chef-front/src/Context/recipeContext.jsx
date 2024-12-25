import React, { createContext, useContext, useState } from "react";

const RecipeContext = createContext();

export const RecipeProvider = ({children}) => {
    const [recipeList, setRecipeList] = useState([]);
    const [recipeIngres, setRecipeIngres] = useState([]);
    const [recipeSteps, setRecipeSteps] = useState([]);
    const [selectedRecipeUrl, setSelectedRecipeUrl] = useState(null);

    return(
        <RecipeContext.Provider value={{recipeList, setRecipeList, recipeIngres, setRecipeIngres, recipeSteps, setRecipeSteps, selectedRecipeUrl, setSelectedRecipeUrl}}>
            {children}
        </RecipeContext.Provider>
    )
}

export const useRecipeContext = () => useContext(RecipeContext);