//기타
import React from "react";

//CSS
import styles from "../../../CSS/main/common/left.module.css";

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
        <div className={styles.body}>
            <img 
                onClick={goToTopSlide} 
                className={styles.logo} 
                src={`${serverUrl}/Image/CommonImage/LogoWhite.png`}/>
            <MainIcon 
                toggleLoginModal={toggleLoginModal} 
                toggleMenuModal={toggleMenuModal} 
                menuModal={menuModal}/>
        </div>
    )
};

export default MainLeft;