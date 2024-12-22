import React from "react";
import IngredientEach from "./ingredientEach";

const IngredientSection = (props) => {
    const { index, ingreEachs } = props;

    return(
        <div className="cusWrIngreSec">
            <div className="cusWrIngreSecHead">
                <input type="text" className="cusWrIngreSecHeadName" placeholder="재료 section name"/>
                <img className="cusWrIngreSecHeadImg" src="/Image/CommonImage/delete.png"/>
            </div>
            {ingreEachs.map((ingreEach) => {
                <IngredientEach/>
            })}
            <div className="cusWrIngreEachPlus">
                <img className="cusWrIngreEachAddImg" src="/Image/CommonImage/add.png"/>
            </div>
        </div>
    )
}

export default IngredientSection;