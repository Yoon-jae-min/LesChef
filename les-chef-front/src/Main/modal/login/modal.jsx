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
            switchFindToLogin } = props;

    const HandlerLoginModal = (e) => {
        if(e.target.closest('.loginBox')){
            
            console.log('text');
            return;
        }
        if(loginModal){
            toggleLoginModal();
        }else if(loginToFind){
            toggleFindBox();
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
                    toggleLoginModal={toggleLoginModal}/>}
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