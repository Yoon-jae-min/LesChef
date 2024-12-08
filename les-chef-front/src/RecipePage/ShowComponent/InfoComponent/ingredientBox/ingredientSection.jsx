import React from "react";
import InfoIngredientEach from "./ingredientEach";

const InfoIngredientSection = (props) => {
    const { sectionText } = props;

    return(
        <div className="infoIngredientSection">
            <p className="sectionText">{sectionText}</p>
            <InfoIngredientEach ingredientName="묵은지" ingredientCount="1/4" ingredientUnit="포기"/>
            <InfoIngredientEach ingredientName="참치캔(작은캔)" ingredientCount="1" ingredientUnit="개"/>
            <InfoIngredientEach ingredientName="두부" ingredientCount="1/2" ingredientUnit="모"/>
            <InfoIngredientEach ingredientName="양파" ingredientCount="1/2" ingredientUnit="개"/>
            <InfoIngredientEach ingredientName="대파" ingredientCount="1/4" ingredientUnit="대"/>
            <InfoIngredientEach ingredientName="청양고추" ingredientCount="1" ingredientUnit="개"/>
            <InfoIngredientEach ingredientName="다진 마늘" ingredientCount="1" ingredientUnit="작은술"/>
            <InfoIngredientEach ingredientName="들기름" ingredientCount="1" ingredientUnit="큰술"/>
            <InfoIngredientEach ingredientName="김치국물" ingredientCount="2" ingredientUnit="큰술"/>
            <InfoIngredientEach ingredientName="설탕" ingredientCount="1/2" ingredientUnit="큰술"/>
            <InfoIngredientEach ingredientName="고춧가루" ingredientCount="1" ingredientUnit="큰술"/>
            <InfoIngredientEach ingredientName="쌀뜨물(또는 멸치육수)" ingredientCount="200" ingredientUnit="ml"/>
        </div>
    )
}

export default InfoIngredientSection;