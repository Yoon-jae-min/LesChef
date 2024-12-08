import React from "react";

const InfoIngredientEach = (props) => {
    const { ingredientName, ingredientCount, ingredientUnit } = props

    return(
        <div className="infoIngredientEach">
            <p className="ingredientName">{ingredientName}</p>
            <div className="ingredientAmount">
                <p className="ingredientCount">{ingredientCount}</p>
                <p className="ingredientUnit">{ingredientUnit}</p>
            </div>
            
        </div>
    )
}

export default InfoIngredientEach;