//기타
import React from "react";

//CSS
import styles from "../../../../CSS/recipe/info/step.module.css";

const Unit = (props) => {
    const { imageSrc, 
            stepNum, 
            stepText} = props;

    return(
        <div className={styles.unit}>
            <img className={styles.unitImg} src={imageSrc}/>
            <div className={styles.textBox}>
                <p className={styles.num}>Step {stepNum}.</p>
                <p className={styles.text}>
                    {stepText.split('\n').map((line, index) => {
                        return(
                            <React.Fragment key={index}>
                                {line}
                                <br/>
                            </React.Fragment>
                        )
                    })}
                </p>
            </div>
        </div>
    )
}

export default Unit;