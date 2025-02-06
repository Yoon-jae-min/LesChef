import React, { createContext, useContext, useState } from "react";

const RecipeContext = createContext();

export const RecipeProvider = ({children}) => {
    const [recipeList, setRecipeList] = useState([]);
    const [soltText, setSoltText] = useState("전체");
    const [recipeIngres, setRecipeIngres] = useState([]);
    const [recipeSteps, setRecipeSteps] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [recipeWish, setRecipeWish] = useState(false);

    //레시피 등록 정보
    // const [wrRecipeInfo, setWrRecipeInfo] = useState({
    //     cookLevel: "",
    //     cookTime: 0,
    //     createdAt: "",
    //     majorCategory: "",
    //     portion: 0,
    //     portionUnit: "",
    //     recipeImg: "/Image/CommonImage/preImg.png",
    //     recipeName: "",
    //     subCategory: "",
    // });
    const [wrRecipeInfo, setWrRecipeInfo] = useState(null);
    const [wrRecipeIngres, setWrRecipeIngres] = useState([]);
    const [wrRecipeSteps, setWrRecipeSteps] = useState([]);
    const [wrRecipeImg, setWrRecipeImg] = useState(null);
    const [wrStepImgs, setWrStepImgs] = useState([]);

    return(
        <RecipeContext.Provider 
            value={{recipeList, setRecipeList,
                    soltText, setSoltText,
                    recipeIngres, setRecipeIngres, 
                    recipeSteps, setRecipeSteps, 
                    selectedRecipe, setSelectedRecipe,
                    recipeWish, setRecipeWish,
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