//기타
import React from "react";

//CSS
import styles from "../../../../CSS/recipe/info/ingredient.module.css";

//컴포넌트
import Unit from "./unit";

const Ingredient = (props) => {
    const { recipeIngres } = props;

    return(
        <div className={styles.body}>
            {recipeIngres.map((recipeIngre, index) => {
                return(
                    <div className={styles.section} key={index}>
                        <p className={styles.sectionName}>{recipeIngre.sortType}</p>
                        {recipeIngre.ingredientUnit.map((ingreUnit, unitIndex) => {
                            return(
                                <Unit
                                    key={unitIndex}
                                    ingredientName={ingreUnit.ingredientName} 
                                    ingredientCount={ingreUnit.volume} 
                                    ingredientUnit={ingreUnit.unit}/>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

export default Ingredient;