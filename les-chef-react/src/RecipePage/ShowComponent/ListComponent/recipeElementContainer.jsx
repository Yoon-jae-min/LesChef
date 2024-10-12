import React, { useState } from "react";
import RecipeElement from "./recipeElement";

const ElementContainer = (props) => {
    const {setInfoGoto} = props;
    const [elementCount, setElementCount] = useState(4);

    return(
        <div className="elementContainer">
            {Array.from({length: elementCount}).map(() => {
                return <RecipeElement setInfoGoto={setInfoGoto}/>
            })}
        </div>
    )
}

export default ElementContainer;