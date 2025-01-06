//기타
import React from "react";

//CSS
import styles from "../../CSS/recipe/menu/menu.module.css"

const TextUnit = (props) => {
    const { koreanTxt, 
            englishTxt, 
            setCategory, 
            setInfoGoto } = props;

    const HandlerClick = () => {
        setCategory(englishTxt);
        setInfoGoto(false);
        localStorage.setItem("selectedCategory", englishTxt);
    }

    return(
        <div className={styles.textUnit}>
            <span className={styles.koreanText} onClick={HandlerClick}>{koreanTxt}</span>
            <span className={styles.englishText}>{englishTxt}</span>
        </div>
    )
}

export default TextUnit;