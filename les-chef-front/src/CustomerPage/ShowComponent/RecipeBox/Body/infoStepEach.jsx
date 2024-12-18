import React from "react";

const InfoStepEach = (props) => {
    const { imageSrc, stepNum, stepText, stepTip } = props;

    return(
        <div className="customerRecipeStepEach">
            <img className="infoStepImg" src={imageSrc}/>
            <div className="stepTextBox">
                <p className="stepNum">Step {stepNum}.</p>
                <p className="stepText">
                    {stepText}
                    { (stepTip !== "") && <p className="stepTip">{stepTip}</p> }
                </p>
            </div>
        </div>
    );
}

export default InfoStepEach;