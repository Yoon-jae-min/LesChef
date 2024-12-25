import React from "react";

const InfoStepEach = (props) => {
    const { imageSrc, stepNum, stepText} = props;

    return(
        <div className="infoStepEach">
            <img className="infoStepImg" src={imageSrc}/>
            <div className="stepTextBox">
                <p className="stepNum">Step {stepNum}.</p>
                <p className="stepText">
                    {stepText.split('\n').map((line) => {
                        return(
                            <React.Fragment>
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

export default InfoStepEach;