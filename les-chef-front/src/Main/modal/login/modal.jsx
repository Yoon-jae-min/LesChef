//기타
import React from "react";

//CSS
import styles from "../../../CSS/main/modal/login.module.css";

//컴포넌트
import LoginBox from "./box";
import FindBox from "../find/box";

const LoginModal = (props) => {
    const { loginModal,
            idPwBox, 
            toggleFindBox, 
            toggleLoginModal, 
            toggleFindIdPw, 
            goToJoinBox, 
            goToTopSlide,
            loginToFind,
            switchFindToLogin,
            setLoginModal,
            pageInfo } = props;

    const HandlerLoginModal = (e) => {
        if(e.target.closest('.loginBox')){
            return;
        }
        if(loginModal){
            toggleLoginModal();
            if(loginToFind){
                toggleFindBox();
            }
        }
    }

    return(
        <div className={styles.body} 
            onClick={HandlerLoginModal} 
            style={{ zIndex: loginModal || loginToFind ? '152' : '-1'}}>
            {!loginToFind && 
                <LoginBox 
                    loginModal={loginModal} 
                    goToJoinBox={goToJoinBox} 
                    goToTopSlide={goToTopSlide}
                    toggleFindBox={toggleFindBox} 
                    toggleLoginModal={toggleLoginModal}
                    setLoginModal={setLoginModal}
                    pageInfo={pageInfo}/>}
            {loginToFind && 
                <FindBox 
                    toggleFindIdPw={toggleFindIdPw} 
                    idPwBox={idPwBox} 
                    loginToFind={loginToFind}
                    toggleFindBox={toggleFindBox}
                    switchFindToLogin={switchFindToLogin}/>}
        </div>
    )
}

export default LoginModal;