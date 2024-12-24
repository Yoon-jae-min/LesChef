import React from "react";
import MainIcon from './iconBox';
import { useConfig } from "../../../Context/configContext";

const MainLeft = (props) => {
    const {goToTopSlide, toggleLoginModal, toggleMenuModal, menuModal} = props;
    const { serverUrl } = useConfig();

    return (
        <div className='mainLeft'>
            <img onClick={goToTopSlide} className='mainLogo' src={`${serverUrl}/Image/CommonImage/LogoWhite.png`}/>
            <MainIcon toggleLoginModal={toggleLoginModal} toggleMenuModal={toggleMenuModal} menuModal={menuModal}/>
        </div>
    )
};

export default MainLeft;