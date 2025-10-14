//기타
import React from "react";

//CSS
import styles from "../../../CSS/recipe/show/subHead.module.css"

//컴포넌트
import Left from "./left";
import Right from "./right";

const RecipeShowGpBox = (props) => {
    const {category, infoGoto} = props;

    return(
        <div className={styles.body}>
            <Left 
                category={category} 
                infoGoto={infoGoto}/>
            <Right 
                infoGoto={infoGoto}/>
        </div>
    )
}

export default RecipeShowGpBox;