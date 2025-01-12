//기타
import React from "react";

//CSS
import styles from "../../CSS/recipe/menu/menu.module.css"

//컨텍스트
import { useUserContext } from "../../Context/user";

const TextUnit = (props) => {
    const { koreanTxt, 
            englishTxt, 
            setCategory, 
            setInfoGoto } = props;
    const {authCheck} = useUserContext();

    const HandlerClick = async () => {
        setCategory(englishTxt);
        setInfoGoto(false);
        localStorage.setItem("selectedCategory", englishTxt);
        await authCheck();
    }

    return(
        <div className={styles.textUnit}>
            <span className={styles.koreanText} onClick={HandlerClick}>{koreanTxt}</span>
            <span className={styles.englishText}>{englishTxt}</span>
        </div>
    )
}

export default TextUnit;