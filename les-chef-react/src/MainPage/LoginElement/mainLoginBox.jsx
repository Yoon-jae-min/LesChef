import React from "react";
import LoginLogo from "../../Image/CommonImage/LogoWhite.png"
import LoginInput from "./loginInputBox.jsx";
import KakaoLoginButton from "../../Image/MainImage/kakaoLoginButton.png"
import NaverIcon from "../../Image/MainImage/naverIcon.png"
import '../googleButton.css'

const LoginBox = (props) => {
    const {loginModal, goToJoinBox, toggleFindBox} = props;

    return(
        <div className="loginBox" style={{opacity: loginModal ? '1' : '0'}}>
            <img className='LoginLogo' src={LoginLogo}/>
            <LoginInput/>
            <p id="findUser" onClick={toggleFindBox}>아이디/비밀번호 찾기</p>
            <button className="loginButton">로그인</button>
            <div id="hrAndOr"><hr/><p>or</p><hr/></div>
            <div id="SNSLogin">
                <div id="kakaoButtonContainer">
                    <img src={KakaoLoginButton}></img>
                </div>
                <div id="googleButtonContainer">
                    <div id="customBtn" class="customGPlusSignIn">
                    <span class="icon"></span>
                    <span class="buttonText">로그인</span>
                    </div>
                </div>
                <div id="naverButtonContainer">
                    <img className="naverIcon" src={NaverIcon}></img>
                    <span className="buttonText">로그인</span>
                </div>
            </div>
            <div className="textJoinBox"><span>아직 회원이 아니신가요?</span><span className='goToJoinText' onClick={goToJoinBox}>회원가입</span></div>
        </div>
    )
}

export default LoginBox;