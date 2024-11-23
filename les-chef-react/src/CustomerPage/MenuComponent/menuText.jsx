import React from "react";
import MenuTxtUnit from "./menuTxtUnit";

const MainMenuText = () => {
    return(
        <div className="customerMenuText">
            <MenuTxtUnit koreanTxt="내 정보" englishTxt="My Info"/>
            <MenuTxtUnit koreanTxt="나의 레시피" englishTxt="My Recipe"/>
            <MenuTxtUnit koreanTxt="나의 식재료" englishTxt="My Foods"/>
            <MenuTxtUnit koreanTxt="찜 목록" englishTxt="Wish List"/>
        </div>
    )
}

export default MainMenuText;