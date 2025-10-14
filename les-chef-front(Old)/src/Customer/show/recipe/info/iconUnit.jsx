//기타
import React from "react";

//CSS
import styles from "../../../../CSS/recipe/info/icon.module.css";

const IconEach = (props) => {
    const { infoIconImg, infoIconText } = props;

    return(
        <div className={styles.unit}>
            <img className={styles.unitImg} src={infoIconImg}/>
            <p className={styles.unitText}>{infoIconText}</p>
        </div>
    )
}

export default IconEach;