//기타
import React from "react";

//CSS
import styles from "../../../CSS/recipe/list/list.module.css"

//컨텍스트
import { useConfig } from "../../../Context/config";
import { useRecipeContext } from "../../../Context/recipe";

const Unit = (props) => {
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
        <div className={styles.unit} onClick={handleClick}>
            <img className={styles.unitImg} src={`${serverUrl}${recipeImg}`}/>
            <p className={styles.name}>{recipeName}</p>
            <div className={styles.infoBox}>
                <div className={styles.nickName}>{isShare && recipeNickName}</div>
                <div className={styles.countBox}>
                    <img className={styles.countImg} src={`${serverUrl}/Image/CommonImage/watch.png`}/>
                    <div className={styles.countText}>{recipeWatch}</div>
                </div>
            </div>
        </div>
    )
}

export default Unit;