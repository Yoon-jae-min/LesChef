import React from "react";
import MainLogo from "../../Image/MainImage/LogoWhite.png"
import MainIcon from './mainIconBox';

const MainLeft = () => {
    return (
        <div className='mainLeft'>
            <a href='#'><img className='mainLogo' src={MainLogo}/></a>
            <MainIcon/>
        </div>
    )
};

export default MainLeft;