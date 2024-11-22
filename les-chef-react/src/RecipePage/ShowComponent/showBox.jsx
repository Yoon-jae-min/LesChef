import React, { useEffect, useState } from "react";
import ShowHead from "./showHeader";
import ShowSubHead from "./SubHead/showSubHead";
import ListContainer from "./ListComponent/listContainer";
import InfoContainer from "./InfoComponent/InfoContainer";
import "./ListComponent/listComponent.css";
import "./InfoComponent/infoComponent.css";

const RecipeShowBox = (props) => {
    const {category, infoGoto, setInfoGoto} = props;

    return(
        <div className="recipeShowBox">
            <ShowHead category={category}/>
            <ShowSubHead category={category} infoGoto={infoGoto}/>
            <hr/>
            { !infoGoto && <ListContainer setInfoGoto={setInfoGoto}/> }
            { infoGoto && <InfoContainer/> }
            <hr/>
        </div>
    )
}

export default RecipeShowBox;