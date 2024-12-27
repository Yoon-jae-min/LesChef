//기타
import React from "react";

//컨텍스트
import { useConfig } from "../../../Context/configContext";

//컴포넌트
import MainIcon from './iconBox';

const MainLeft = (props) => {
    const { goToTopSlide, 
            toggleLoginModal, 
            toggleMenuModal, 
            menuModal} = props;
    const { serverUrl } = useConfig();

    return (
        <div className='mainLeft'>
            <img 
                onClick={goToTopSlide} 
                className='mainLogo' 
                src={`${serverUrl}/Image/CommonImage/LogoWhite.png`}/>
            <MainIcon 
                toggleLoginModal={toggleLoginModal} 
                toggleMenuModal={toggleMenuModal} 
                menuModal={menuModal}/>
        </div>
    )
};

export default MainLeft;