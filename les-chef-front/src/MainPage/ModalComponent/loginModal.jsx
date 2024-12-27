//기타
import React from "react";

//컴포넌트
import LoginBox from "../LoginComponent/loginBox";
import FindBox from "../LoginComponent/findBox";

const LoginModal = (props) => {
    const { toggleFindIdPw, 
            idPwBox, 
            toggleFindBox, 
            toggleLoginModal, 
            loginModal, 
            goToJoinBox, 
            loginToFind} = props;

    const HandlerLoginModal = (e) => {
        if(e.target.closest('.loginBox')){
            return;
        }
        if(loginModal){
            toggleLoginModal();
        }else if(loginToFind){
            toggleFindBox();
        }

    }

    return(
        <div id="mainLoginModal" 
            onClick={HandlerLoginModal} 
            style={{ zIndex: loginModal || loginToFind ? '152' : '-1'}}>
            {!loginToFind && 
                <LoginBox 
                    loginModal={loginModal} 
                    goToJoinBox={goToJoinBox} 
                    toggleFindBox={toggleFindBox} 
                    toggleLoginModal={toggleLoginModal}/>}
            {loginToFind && 
                <FindBox 
                    toggleFindIdPw={toggleFindIdPw} 
                    idPwBox={idPwBox} 
                    loginToFind={loginToFind}/>}
        </div>
    )
}

export default LoginModal;