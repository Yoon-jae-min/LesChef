//기타
import React from "react";

//컨텍스트
import { useConfig } from "../../../../../Context/configContext";
import { useRecipeContext } from "../../../../../Context/recipeContext";

const RecipeListUnit = (props) => {
    const { setInfoPage, 
            setListPage, 
            recipeImgUrl, 
            recipeName,
            recipeNickName,
            recipeWatch } = props;
    const {serverUrl} = useConfig();
    const { setRecipeIngres, 
            setRecipeSteps, 
            setSelectedRecipe } = useRecipeContext();

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
            <p className="customerListText">{recipeName}</p>
            <div className="customerListInfo">
                <div className="customerNickNameBox">{recipeNickName}</div>
                <div className="cusListWatchBox">
                    <img className="cusListWatchImg" src={`${serverUrl}/Image/CommonImage/watch.png`}/>
                    <div className="customerListWatchs">{recipeWatch}</div>
                </div>
                
            </div>
        </div>
    )
}

export default RecipeListUnit;