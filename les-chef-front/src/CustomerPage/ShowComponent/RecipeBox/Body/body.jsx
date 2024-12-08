import React, { useState } from "react";
import RecipeListUnit from "./listUnit";


const RecipeBody = () => {
    const [elementCount, setElementCount] = useState(4);

    return(
        <div className="customerRecipeBody">
            {Array.from({length: elementCount}).map(() => {
                return <RecipeListUnit/>
            })}
        </div>
    )
}

export default RecipeBody;