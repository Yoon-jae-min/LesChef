import React from "react";
import { useConfig } from "../../../Context/configContext";
import { useRecipeContext } from "../../../Context/recipeContext";

const RecipeElement = (props) => {
    const {setInfoGoto, recipeImg, recipeName} = props;
    const {serverUrl} = useConfig();
    const {setRecipeIngres, setRecipeSteps, setSelectedRecipeUrl, recipeSteps, recipeIngres} = useRecipeContext();

    const handleClick = () => {
        fetch(`${serverUrl}/recipe/info?recipeName=${encodeURIComponent(recipeName)}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data.recipeSteps);
            setRecipeIngres(data.recipeIngres);
            setRecipeSteps(data.recipeSteps);
            setSelectedRecipeUrl(recipeImg);
            setInfoGoto(true);
        }).catch(err => console.log(err));
    }

    return(
        <div className="recipeElement" onClick={handleClick}>
            <img className="elementImg" src={`${serverUrl}${recipeImg}`}/>
            <div className="elementInfoBox">
                <p className="listRecipeTitle">{recipeName}</p>
                <div className="starBox"></div>
                <div className="showCountBox"></div>
            </div>
        </div>
    )
}

export default RecipeElement;