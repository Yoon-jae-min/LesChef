//기타
import React from "react";

//CSS
import styles from "../../../../CSS/recipe/info/step.module.css";

//컨텍스트
import { useConfig } from "../../../../Context/configContext";

//컴포넌트
import Unit from "./unit";

const Step = (props) => {
    const {serverUrl} = useConfig();
    const {recipeSteps} = props;

    return(
        <div className={styles.body}>
            {recipeSteps.map((recipeStep, index) => {
                return (
                    <Unit
                        key={index} 
                        imageSrc={`${serverUrl}${recipeStep.stepImg}`} 
                        stepNum={recipeStep.stepNum} 
                        stepText={recipeStep.stepWay}/>
                )
            })}
        </div>
    )
}

export default Step;