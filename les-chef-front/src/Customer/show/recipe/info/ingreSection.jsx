//기타
import React from "react";

//CSS
import styles from "../../../../CSS/recipe/info/ingredient.module.css";

//컴포넌트
import IngredientEach from "./ingreUnit";

const IngredientSection = (props) => {
    const { sectionText, recipeIngres } = props;

    return(
        <div className={styles.section}>
            {recipeIngres.map((recipeIngre) => {
                return(
                    <React.Fragment>
                        <p className={styles.sectionName}>{recipeIngre.sortType}</p>
                        {recipeIngre.ingredientUnit.map((ingre, index) => {
                            return(
                                <IngredientEach 
                                    key={index}
                                    ingredientName={ingre.ingredientName}
                                    ingredientCount={ingre.volume}
                                    ingredientUnit={ingre.unit}/>
                            )
                        })}
                    </React.Fragment>
                )
            })}
        </div>
    )
}

export default IngredientSection;