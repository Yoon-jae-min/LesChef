//기타
import React from "react";

//CSS
import styles from "../../../../CSS/customer/show/reicpe/info/info.module.css";

//컨텍스트
import { useConfig } from "../../../../Context/config";
import { useRecipeContext } from "../../../../Context/recipe";

//컴포넌트
import InfoStepEach from "./stepUnit";
import IngredientSection from "./ingreSection";
import IconEach from "./iconUnit";


const InfoBox = () => {
    const {serverUrl} = useConfig();
    const { recipeIngres, 
            recipeSteps, 
            selectedRecipe } = useRecipeContext();

    return(
        <>
            <div className={styles.left}>
                <img className={styles.mainImg} src={`${serverUrl}${selectedRecipe.recipeImg}`}/>
                <div className={styles.stepBox}>
                    {recipeSteps.map((step, index) => {
                        return(
                            <InfoStepEach
                                key={index}
                                imageSrc={`${serverUrl}${step.stepImg}`}
                                stepNum={step.stepNum}
                                stepText={step.stepWay}
                            />
                        )
                    })}
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.ingreBox}>
                    <IngredientSection 
                        recipeIngres={recipeIngres}/>
                </div>
                <div className={styles.iconBox}>
                    <IconEach 
                        infoIconImg={`${serverUrl}/Image/RecipeImage/InfoImg/timer.png`} 
                        infoIconText={`${selectedRecipe.cookTime}분`}/>
                    <IconEach 
                        infoIconImg={`${serverUrl}/Image/RecipeImage/InfoImg/people.png`} 
                        infoIconText={`${selectedRecipe.portion}${selectedRecipe.portionUnit}`}/>
                    <IconEach 
                        infoIconImg={`${serverUrl}/Image/RecipeImage/InfoImg/level.png`} 
                        infoIconText={`${selectedRecipe.cookLevel}`}/>
                </div>
            </div>
        </>
    )
}

export default InfoBox;