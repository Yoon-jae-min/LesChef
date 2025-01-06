//기타
import React from "react";

//CSS
import styles from "../../CSS/customer/menu/menu.module.css";

const MenuTxtUnit = (props) => {
    const { koreanTxt, 
            englishTxt, 
            setCategory, 
            checkUser } = props;

    const HandlerClick = () => {
        checkUser();
        setCategory(englishTxt);
    }

    return(
        <div className={styles.textUnit}>
            <span className={styles.korean} onClick={HandlerClick}>{koreanTxt}</span>
            <span className={styles.english}>{englishTxt}</span>
        </div>
    )
}

export default MenuTxtUnit;