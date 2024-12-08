import React from "react";
import MainIcon from './iconBox';

const MainLeft = (props) => {
    const {goToTopSlide, toggleLoginModal, toggleMenuModal, menuModal} = props;

    return (
        <div className='mainLeft'>
            <img onClick={goToTopSlide} className='mainLogo' src="/Image/CommonImage/LogoWhite.png"/>
            <MainIcon toggleLoginModal={toggleLoginModal} toggleMenuModal={toggleMenuModal} menuModal={menuModal}/>
        </div>
    )
};

export default MainLeft;