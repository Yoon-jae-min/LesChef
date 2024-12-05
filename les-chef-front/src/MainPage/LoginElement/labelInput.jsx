import React from "react";

const LabelInput = (props) => {
    return(
        <div>
            <label className="eachLabel">{props.labelText}</label>
            <input className="eachInput"></input>
        </div>
    )
}

export default LabelInput;