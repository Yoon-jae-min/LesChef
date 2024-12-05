import React from "react";
import LoginInput from "./loginInputBox.jsx";
import '../googleButton.css'

const LoginBox = (props) => {
    const {loginModal, goToJoinBox, toggleFindBox} = props;

    return(
        <div className="loginBox" style={{opacity: loginModal ? '1' : '0'}}>
            <img className='LoginLogo' src="/Image/CommonImage/LogoWhite.png"/>
            <LoginInput/>
            <p id="findUser" onClick={toggleFindBox}>아이디/비밀번호 찾기</p>
            <button className="loginButton">로그인</button>
            <div id="hrAndOr"><hr/><p>or</p><hr/></div>
            <div id="SNSLogin">
                <div id="kakaoButtonContainer">
                    <img src="/Image/MainImage/kakaoLoginButton.png"></img>
                </div>
                <div id="googleButtonContainer">
                    <div id="customBtn" class="customGPlusSignIn">
                    <span class="icon"></span>
                    <span class="buttonText">로그인</span>
                    </div>
                </div>
                <div id="naverButtonContainer">
                    <img className="naverIcon" src="/Image/MainImage/naverIcon.png"></img>
                    <span className="buttonText">로그인</span>
                </div>
            </div>
            <div className="textJoinBox"><span>아직 회원이 아니신가요?</span><span className='goToJoinText' onClick={goToJoinBox}>회원가입</span></div>
        </div>
    )
}

export default LoginBox;