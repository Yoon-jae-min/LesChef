import React from "react";

const MenuTxtUnit = (props) => {
    const {koreanTxt, englishTxt, setCategory, setInfoGoto} = props;

    const HandlerClick = () => {
        setCategory(englishTxt);
        setInfoGoto(false);
    }

    return(
        <div className="menuTxtUnit">
            <span className="koreanText" onClick={HandlerClick}>{koreanTxt}</span>
            <span className="englishText">{englishTxt}</span>
        </div>
    )
}

export default MenuTxtUnit;