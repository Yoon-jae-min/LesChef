import React from "react";
import { useConfig } from "../../../../../Context/configContext";
import { useRecipeContext } from "../../../../../Context/recipeContext";

const RecipeListUnit = (props) => {
    const { setInfoPage, setListPage, recipeImgUrl, recipeName } = props;
    const {serverUrl} = useConfig();
    const {setRecipeIngres, setRecipeSteps, setSelectedRecipe} = useRecipeContext();

    const clickUnit = () => {
        fetch(`${serverUrl}/recipe/info?recipeName=${recipeName}`)
            .then(response => response.json())
            .then((data) => {
                setRecipeIngres(data.recipeIngres);
                setRecipeSteps(data.recipeSteps);
                setSelectedRecipe(data.selectedRecipe);
                setInfoPage(true);
                setListPage(false);
            }).catch(err => console.log(err));
    }

    return(
        <div className="recipeListUnit" onClick={clickUnit}>
            <img className="customerListImg" src={`${serverUrl}${recipeImgUrl}`}/>
            <div className="customerListInfo">
                <p className="customerListText">{recipeName}</p>
                <div className="customerListStars"></div>
                <div className="customerListWatchs"></div>
            </div>
        </div>
    )
}

export default RecipeListUnit;