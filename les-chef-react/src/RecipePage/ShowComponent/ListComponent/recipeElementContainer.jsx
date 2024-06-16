import React, { useState } from "react";
import RecipeElement from "./recipeElement";

const ElementContainer = () => {
    const [elementCount, setElementCount] = useState(4);

    return(
        <div className="elementContainer">
            {Array.from({length: elementCount}).map(() => {
                return <RecipeElement/>
            })}
        </div>
    )
}

export default ElementContainer;