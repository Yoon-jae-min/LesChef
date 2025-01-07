//기타
import React from "react";

//CSS
import info from "../../../../CSS/customer/show/reicpe/info/info.module.css";
import step from "../../../../CSS/recipe/info/step.module.css";

const InfoStepEach = (props) => {
    const { imageSrc, 
            stepNum, 
            stepText } = props;

    return(
        <div className={info.stepEach}>
            <img className={step.unitImg} src={imageSrc}/>
            <div className={step.textBox}>
                <p className={step.num}>Step {stepNum}.</p>
                <p className={step.text}>
                    {stepText.split('\n').map((line) => {
                        return (
                            <React.Fragment>
                                {line}<br/>
                            </React.Fragment>
                        )
                    })}
                </p>
            </div>
        </div>
    );
}

export default InfoStepEach;