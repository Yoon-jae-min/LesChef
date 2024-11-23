import React from "react";

const MenuTxtUnit = (props) => {
    const {koreanTxt, englishTxt} = props;

    return(
        <div className="customerMenuTxtUnit">
            <span className="customerKoreanText">{koreanTxt}</span>
            <span className="customerEnglishText">{englishTxt}</span>
        </div>
    )
}

export default MenuTxtUnit;