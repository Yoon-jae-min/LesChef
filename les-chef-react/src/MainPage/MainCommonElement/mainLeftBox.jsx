import React from "react";
import MainLogo from "../../Image/CommonImage/LogoWhite.png"
import MainIcon from './mainIconBox';
import { Link } from "react-router-dom";

const MainLeft = (props) => {
    const {toggleLoginModal, toggleMenuModal, menuModal} = props;

    return (
        <div className='mainLeft'>
            <img className='mainLogo' src={MainLogo}/>
            <MainIcon toggleLoginModal={toggleLoginModal} toggleMenuModal={toggleMenuModal} menuModal={menuModal}/>
        </div>
    )
};

export default MainLeft;