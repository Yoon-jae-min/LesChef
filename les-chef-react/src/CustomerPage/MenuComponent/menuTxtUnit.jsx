import React from "react";

const MenuTxtUnit = (props) => {
    const {koreanTxt, englishTxt, setCategory} = props;

    const HandlerClick = () => {
        setCategory(englishTxt);
    }

    return(
        <div className="customerMenuTxtUnit">
            <span className="customerKoreanText" onClick={HandlerClick}>{koreanTxt}</span>
            <span className="customerEnglishText">{englishTxt}</span>
        </div>
    )
}

export default MenuTxtUnit;