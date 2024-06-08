import React from "react";
import MainLogo from "../../Image/MainImage/LogoWhite.png"
import MainIcon from './mainIconBox';

const MainLeft = (props) => {
    const {toggleLoginModal, toggleMenuModal, menuModal} = props;

    return (
        <div className='mainLeft'>
            <a href='#'><img className='mainLogo' src={MainLogo}/></a>
            <MainIcon toggleLoginModal={toggleLoginModal} toggleMenuModal={toggleMenuModal} menuModal={menuModal}/>
        </div>
    )
};

export default MainLeft;