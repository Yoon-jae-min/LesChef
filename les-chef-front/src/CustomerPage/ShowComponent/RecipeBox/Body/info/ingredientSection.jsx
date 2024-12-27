//기타
import React from "react";

//컴포넌트
import IngredientEach from "./ingredientEach";

const IngredientSection = (props) => {
    const { sectionText, recipeIngres } = props;

    return(
        <div className="infoIngredientSection">
            {recipeIngres.map((recipeIngre) => {
                return(
                    <React.Fragment>
                        <p className="sectionText">{recipeIngre.sortType}</p>
                        {recipeIngre.ingredientUnit.map((ingre) => {
                            return(
                                <IngredientEach 
                                    ingredientName={ingre.ingredientName}
                                    ingredientCount={ingre.volume}
                                    ingredientUnit={ingre.unit}/>
                            )
                        })}
                    </React.Fragment>
                )
            })}
        </div>
    )
}

export default IngredientSection;