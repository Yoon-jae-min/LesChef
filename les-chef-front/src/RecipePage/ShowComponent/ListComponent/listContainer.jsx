import React, { useState } from "react";
import ListElement from "./listInner";

const ElementContainer = (props) => {
    const {setInfoGoto} = props;
    const [elementCount, setElementCount] = useState(4);

    return(
        <div className="elementContainer">
            {Array.from({ length: elementCount }).map((_, index) => {
                return <ListElement key={index} setInfoGoto={setInfoGoto} />;
            })}
        </div>
    )
}

export default ElementContainer;