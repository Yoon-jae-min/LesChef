//기타
import React from "react";

//컨텍스트
import { useConfig } from "../../../../Context/configContext";

//컴포넌트
import InfoStepEach from "./stepEach";

const InfoStepBox = (props) => {
    const {serverUrl} = useConfig();
    const {recipeSteps} = props;

    console.log("Received recipeSteps:", recipeSteps);

    return(
        <div className="infoStepBox">
            {recipeSteps.map((recipeStep, index) => {
                console.log(recipeStep);
                return (
                    <InfoStepEach 
                        key={index} 
                        imageSrc={`${serverUrl}${recipeStep.stepImg}`} 
                        stepNum={recipeStep.stepNum} 
                        stepText={recipeStep.stepWay}/>
                )
            })}
        </div>
    )
}

export default InfoStepBox;