//기타
import React from "react";

//컴포넌트
import InfoIngredientEach from "./ingredientEach";

const InfoIngredientSection = (props) => {
    const { recipeIngres } = props;

    return(
        <div className="infoIngredientSections">
            {recipeIngres.map((recipeIngre, index) => {
                return(
                    <div className="infoIngredientSection" key={index}>
                        <p className="sectionText">{recipeIngre.sortType}</p>
                        {recipeIngre.ingredientUnit.map((ingreUnit, unitIndex) => {
                            return(
                                <InfoIngredientEach
                                    key={unitIndex}
                                    ingredientName={ingreUnit.ingredientName} 
                                    ingredientCount={ingreUnit.volume} 
                                    ingredientUnit={ingreUnit.unit}/>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

export default InfoIngredientSection;