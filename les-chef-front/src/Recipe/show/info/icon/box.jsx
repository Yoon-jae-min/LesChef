//기타
import React from "react";

//CSS
import styles from "../../../../CSS/recipe/info/icon.module.css";

//컨텍스트
import { useConfig } from "../../../../Context/configContext";
import { useRecipeContext } from "../../../../Context/recipeContext";

//컴포넌트
import Unit from "./unit";

const Icon = () => {
    const {serverUrl} = useConfig();
    const {selectedRecipe} = useRecipeContext();

    return(
        <div className={styles.body}>
            <Unit
                infoIconImg={`${serverUrl}/Image/RecipeImage/InfoImg/timer.png`} 
                infoIconText={`${selectedRecipe.cookTime}분`}/>
            <Unit
                infoIconImg={`${serverUrl}/Image/RecipeImage/InfoImg/people.png`} 
                infoIconText={`${selectedRecipe.portion}${selectedRecipe.portionUnit}`}/>
            <Unit
                infoIconImg={`${serverUrl}/Image/RecipeImage/InfoImg/level.png`} 
                infoIconText={`${selectedRecipe.cookLevel}`}/>
        </div>
    )
}

export default Icon;
