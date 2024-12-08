import React, { useState, useEffect } from "react";

const LabelInput = (props) => {
    const { labelText, inputValue, basicValue } = props;

    return(
        <div>
            <label className="eachLabel">{labelText}</label>
            <input value={basicValue} onChange={(e) => inputValue(e.target.value)} className="eachInput"></input>
        </div>
    )
}

export default LabelInput;