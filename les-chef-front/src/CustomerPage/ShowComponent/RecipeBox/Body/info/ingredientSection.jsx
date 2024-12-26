import React from "react";
import IngredientEach from "./ingredientEach";

const IngredientSection = (props) => {
    const { sectionText, recipeIngres } = props;

    return(
        <div className="infoIngredientSection">
            {recipeIngres.map((recipeIngre) => {
                return(
                    <React.Fragment>
                        <p className="sectionText">{sectionText}</p>
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
            {/* <p className="sectionText">{sectionText}</p>
            <IngredientEach ingredientName="스파게티" ingredientCount="170" ingredientUnit="g"/>
            <IngredientEach ingredientName="마늘" ingredientCount="6" ingredientUnit="쪽"/>
            <IngredientEach ingredientName="흰다리새우" ingredientCount="5" ingredientUnit="마리"/>
            <IngredientEach ingredientName="루꼴라(생략 가능)" ingredientCount="한" ingredientUnit="줌"/>
            <IngredientEach ingredientName="페페론치노" ingredientCount="3" ingredientUnit="개"/>
            <IngredientEach ingredientName="이태리파슬리(생략 가능)" ingredientCount="" ingredientUnit="약간"/>
            <IngredientEach ingredientName="올리브오일" ingredientCount="5" ingredientUnit="큰술"/>
            <IngredientEach ingredientName="치킨스톡(고형)" ingredientCount="1/4" ingredientUnit="조각"/>
            <IngredientEach ingredientName="소금" ingredientCount="" ingredientUnit="약간"/>
            <IngredientEach ingredientName="후춧가루" ingredientCount="" ingredientUnit="약간"/> */}
        </div>
    )
}

export default IngredientSection;