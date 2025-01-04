//기타
import React from "react";

//컨텍스트
import { useConfig } from "../../../Context/configContext";
import { useRecipeContext } from "../../../Context/recipeContext";

const RecipeElement = (props) => {
    const { setInfoGoto, 
            recipeImg, 
            recipeName,
            recipeNickName,
            recipeWatch,
            isShare } = props;
    const {serverUrl} = useConfig();
    const { setRecipeIngres, 
            setRecipeSteps, 
            setSelectedRecipe,
            setRecipeWish } = useRecipeContext();

    const handleClick = () => {
        fetch(`${serverUrl}/recipe/info?recipeName=${encodeURIComponent(recipeName)}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setRecipeIngres(data.recipeIngres);
            setRecipeSteps(data.recipeSteps);
            setSelectedRecipe(data.selectedRecipe);
            setRecipeWish(data.recipeWish);
            setInfoGoto(true);
            console.log(data.recipeWish);
        }).catch(err => console.log(err));
    }

    return(
        <div className="recipeElement" onClick={handleClick}>
            <img className="elementImg" src={`${serverUrl}${recipeImg}`}/>
            <p className="listRecipeTitle">{recipeName}</p>
            <div className="elementInfoBox">
                <div className="reciNickNameBox">{isShare && recipeNickName}</div>
                <div className="reciShowCountBox">
                    <img className="reciShowCountImg" src={`${serverUrl}/Image/CommonImage/watch.png`}/>
                    <div className="showCountText">{recipeWatch}</div>
                </div>
            </div>
        </div>
    )
}

export default RecipeElement;