import React from "react";

const InfoStepEach = (props) => {
    const { imageSrc, stepNum, stepText } = props;

    return(
        <div className="customerRecipeStepEach">
            <img className="infoStepImg" src={imageSrc}/>
            <div className="stepTextBox">
                <p className="stepNum">Step {stepNum}.</p>
                <p className="stepText">
                    {stepText}
                </p>
            </div>
        </div>
    );
}

export default InfoStepEach;