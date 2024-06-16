import React from "react";
import LoginBox from "../LoginElement/mainLoginBox";
import FindBox from "../LoginElement/mainFindBox";

const LoginModal = (props) => {
    const {toggleFindIdPw, idPwBox, toggleFindBox, toggleLoginModal, loginModal, goToJoinBox, loginToFind} = props;

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
        <div id="mainLoginModal" onClick={HandlerLoginModal} style={{ zIndex: loginModal || loginToFind ? '152' : '-1'}}>
            {!loginToFind && <LoginBox loginModal={loginModal} goToJoinBox={goToJoinBox} toggleFindBox={toggleFindBox}/>}
            {loginToFind && <FindBox toggleFindIdPw={toggleFindIdPw} idPwBox={idPwBox} loginToFind={loginToFind}/>}
        </div>
    )
}

export default LoginModal;