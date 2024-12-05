import React, { useState } from "react";
import ListElement from "./listElement";

const ElementContainer = (props) => {
    const {setInfoGoto} = props;
    const [elementCount, setElementCount] = useState(4);

    return(
        <div className="elementContainer">
            {Array.from({length: elementCount}).map(() => {
                return <ListElement setInfoGoto={setInfoGoto}/>
            })}
        </div>
    )
}

export default ElementContainer;