import React from "react";
import InfoStepEven from "../stepBox/infoStepEven";
import InfoStepOdd from "../stepBox/infoStepOdd";

const InfoStepBox = () => {
    return(
        <div className="infoStepBox">
            <InfoStepOdd/>
            <InfoStepEven/>
        </div>
    )
}

export default InfoStepBox;