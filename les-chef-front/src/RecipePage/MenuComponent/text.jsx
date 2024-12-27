//기타
import React from "react";

//컴포넌트
import MenuTxtUnit from "./textUnit";

const RecipeMenuText = (props) => {
    const {setCategory, setInfoGoto} = props;

    return(
        <div className="recipeMenuText">
            <MenuTxtUnit 
                koreanTxt="한식레시피" 
                englishTxt="korean" 
                setCategory={setCategory} 
                setInfoGoto={setInfoGoto}/>
            <MenuTxtUnit 
                koreanTxt="일식레시피" 
                englishTxt="japanese" 
                setCategory={setCategory} 
                setInfoGoto={setInfoGoto}/>
            <MenuTxtUnit 
                koreanTxt="중식레시피" 
                englishTxt="chinese" 
                setCategory={setCategory} 
                setInfoGoto={setInfoGoto}/>
            <MenuTxtUnit 
                koreanTxt="양식레시피" 
                englishTxt="western" 
                setCategory={setCategory} 
                setInfoGoto={setInfoGoto}/>
            <MenuTxtUnit 
                koreanTxt="공유레시피" 
                englishTxt="share" 
                setCategory={setCategory} 
                setInfoGoto={setInfoGoto}/>
        </div>
    )
}

export default RecipeMenuText;