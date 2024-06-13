import React from "react";

const MenuTxtUnit = (props) => {
    const {koreanTxt, englishTxt} = props;

    return(
        <div className="menuTxtUnit">
            <span className="koreanText">{koreanTxt}</span>
            <span className="englishText">{englishTxt}</span>
        </div>
    )
}

export default MenuTxtUnit;