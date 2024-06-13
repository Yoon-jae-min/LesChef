import React from "react";
import MenuTxtUnit from "./menuTxtUnit";

const RecipeMenuText = () => {
    return(
        <div className="recipeMenuText">
            <MenuTxtUnit koreanTxt="한식레시피" englishTxt="korean"/>
            <MenuTxtUnit koreanTxt="일식레시피" englishTxt="japanese"/>
            <MenuTxtUnit koreanTxt="중식레시피" englishTxt="chinese"/>
            <MenuTxtUnit koreanTxt="양식레시피" englishTxt="western"/>
            <MenuTxtUnit koreanTxt="공유레시피" englishTxt="share"/>
        </div>
    )
}

export default RecipeMenuText;