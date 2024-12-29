import React, { createContext, useContext, useState } from "react";

const RecipeContext = createContext();

export const RecipeProvider = ({children}) => {
    const [recipeList, setRecipeList] = useState([]);
    const [recipeIngres, setRecipeIngres] = useState([]);
    const [recipeSteps, setRecipeSteps] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    //레시피 등록 정보
    const [wrRecipeInfo, setWrRecipeInfo] = useState({});
    const [wrRecipeIngres, setWrRecipeIngres] = useState([]);
    const [wrRecipeSteps, setWrRecipeSteps] = useState([]);
    const [wrRecipeImg, setWrRecipeImg] = useState(null);
    const [wrStepImgs, setWrStepImgs] = useState([]);

    return(
        <RecipeContext.Provider 
            value={{recipeList, setRecipeList, 
                    recipeIngres, setRecipeIngres, 
                    recipeSteps, setRecipeSteps, 
                    selectedRecipe, setSelectedRecipe,
                    wrRecipeInfo, setWrRecipeInfo,
                    wrRecipeIngres, setWrRecipeIngres,
                    wrRecipeSteps, setWrRecipeSteps,
                    wrRecipeImg, setWrRecipeImg,
                    wrStepImgs, setWrStepImgs}}>
            {children}
        </RecipeContext.Provider>
    )
}

export const useRecipeContext = () => useContext(RecipeContext);