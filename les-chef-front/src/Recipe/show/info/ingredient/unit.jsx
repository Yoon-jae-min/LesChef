//기타
import React from "react";

//CSS
import styles from "../../../../CSS/recipe/info/ingredient.module.css";

const Unit = (props) => {
    const { ingredientName, 
            ingredientCount, 
            ingredientUnit } = props

    return(
        <div className={styles.unit}>
            <p className={styles.unitName}>{ingredientName}</p>
            <div className={styles.unitAmount}>
                <p className={styles.unitCount}>{ingredientCount}</p>
                <p className={styles.unitPortion}>{ingredientUnit}</p>
            </div>
            
        </div>
    )
}

export default Unit;