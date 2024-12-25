import React from "react";
import InfoStepEach from "./stepEach";
import { useConfig } from "../../../../Context/configContext";

const InfoStepBox = (props) => {
    const {serverUrl} = useConfig();
    const {recipeSteps} = props;

    console.log("Received recipeSteps:", recipeSteps);

    return(
        <div className="infoStepBox">
            {recipeSteps.map((recipeStep, index) => {
                console.log(recipeStep);
                return <InfoStepEach key={index} imageSrc={`${serverUrl}${recipeStep.stepImg}`} stepNum={recipeStep.stepNum} stepText={recipeStep.stepWay}/>
            })}
        </div>
    )
}

export default InfoStepBox;