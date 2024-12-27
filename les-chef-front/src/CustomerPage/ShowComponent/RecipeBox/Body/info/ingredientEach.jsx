//기타
import React from "react";

const IngredientEach = (props) => {
    const { ingredientName, 
            ingredientCount, 
            ingredientUnit } = props
    
    return(
        <div className="infoIngredientEach">
            <p className="ingredientName">{ingredientName}</p>
            <div className="ingredientAmount">
                { (ingredientCount !== "") && 
                    <p className="ingredientCount">{ingredientCount}</p> }
                <p className="ingredientUnit">{ingredientUnit}</p>
            </div>
        </div>
    )
}

export default IngredientEach;