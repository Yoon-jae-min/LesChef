//기타
import React from "react";

import styles from "../../../../CSS/recipe/info/info.module.css";

//컨텍스트
import { useConfig } from "../../../../Context/configContext";
import { useRecipeContext } from "../../../../Context/recipeContext";

//컴포넌트
import Ingredient from "../ingredient/box";
import Step from "../step/box";
import Icon from "../icon/box";

const Info = () => {
    const {serverUrl} = useConfig();
    const { recipeIngres, 
            recipeSteps, 
            selectedRecipe} = useRecipeContext();
    
    return(
        <div className={styles.body}>
            <div className={styles.left}>
                <img className={styles.mainImg} src={`${serverUrl}${selectedRecipe.recipeImg}`}/>
                <Step
                    recipeSteps={recipeSteps}/>
            </div>
            <div className={styles.right}>
                <Ingredient
                    recipeIngres={recipeIngres}/>
                <Icon/>
            </div>
        </div>
    )
}

export default Info;