import React from "react";
import MenuTxtUnit from "./menuTxtUnit";

const RecipeMenuText = (props) => {
    const {setCategory} = props;

    return(
        <div className="recipeMenuText">
            <MenuTxtUnit koreanTxt="한식레시피" englishTxt="korean" setCategory={setCategory}/>
            <MenuTxtUnit koreanTxt="일식레시피" englishTxt="japanese" setCategory={setCategory}/>
            <MenuTxtUnit koreanTxt="중식레시피" englishTxt="chinese" setCategory={setCategory}/>
            <MenuTxtUnit koreanTxt="양식레시피" englishTxt="western" setCategory={setCategory}/>
            <MenuTxtUnit koreanTxt="공유레시피" englishTxt="share" setCategory={setCategory}/>
        </div>
    )
}

export default RecipeMenuText;