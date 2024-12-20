import React from "react";

const StepBoxUnit = (props) => {
    const { index, stepDelete } = props;

    return(
        <div className={`cusReciWrStepUnit-${index} cusReciWrStepUnit`}>
            <div className="cusStepUnitContent"></div>
            <div className="cusStepUnitDelete">
                <img src="/Image/CommonImage/delete.png" onClick={stepDelete}/>
            </div>
        </div>
    )
}

export default StepBoxUnit;