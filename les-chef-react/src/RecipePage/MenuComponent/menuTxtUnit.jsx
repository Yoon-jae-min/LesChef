import React from "react";

const MenuTxtUnit = (props) => {
    const {koreanTxt, englishTxt, setCategory} = props;

    const HandlerClick = () => {
        setCategory(englishTxt);
    }

    return(
        <div className="menuTxtUnit">
            <span className="koreanText" onClick={HandlerClick}>{koreanTxt}</span>
            <span className="englishText">{englishTxt}</span>
        </div>
    )
}

export default MenuTxtUnit;