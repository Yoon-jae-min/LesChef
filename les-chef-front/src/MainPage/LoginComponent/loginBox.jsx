import React, { useEffect, useState } from "react";
import LoginInput from "./loginInputBox.jsx";
import { useConfig } from '../../Context/configContext.jsx';
import { useAuthContext } from "../../Context/authContext.jsx";
import '../googleButton.css'

const LoginBox = (props) => {
    const { loginModal, goToJoinBox, toggleFindBox, toggleLoginModal } = props;
    const [ customerId, setCustomerId ] = useState("");
    const [ customerPwd, setCustomerPwd ] = useState("");
    const { serverUrl } = useConfig();
    const { setUser, setIsLogin } = useAuthContext();

    const clickLogin = () => {
        if(customerId === ""){
            alert("아이디를 입력해주세요");
        }else if(customerPwd === ""){
            alert("패스워드를 입력해주세요");
        }else{
            fetch(`${serverUrl}/customer/login`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    customerId : customerId,
                    customerPwd : customerPwd
                }),
                credentials: 'include'
            }).then((response) => {
                return response.text();
            }).then((text) => {
                if(text === "login Success"){
                    fetch(`${serverUrl}/customer/auth`, {
                        method: "GET",
                        headers: { "Content-type": "application/json" },
                        credentials: 'include'
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.loggedIn) {
                            setUser(data.user); 
                            setIsLogin(true); 
                            toggleLoginModal();
                            alert("로그인 하셨습니다.");
                        }
                    });
                }else{
                    alert(text);
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    const inputId = (value) => {
        setCustomerId(value);
    }

    const inputPwd = (value) => {
        setCustomerPwd(value);
    }

    useEffect(() => {
        if(!loginModal){
            setCustomerId("");
            setCustomerPwd("");
        }
    }, [loginModal]);

    return(
        <div className="loginBox" style={{opacity: loginModal ? '1' : '0'}}>
            <img className='LoginLogo' src="/Image/CommonImage/LogoWhite.png"/>
            <LoginInput inputId={inputId} inputPwd={inputPwd} idValue={customerId} pwdValue={customerPwd}/>
            <p id="findUser" onClick={toggleFindBox}>아이디/비밀번호 찾기</p>
            <button className="loginButton" onClick={clickLogin}>로그인</button>
            <div id="hrAndOr"><hr/><p>or</p><hr/></div>
            <div id="SNSLogin">
                <div id="kakaoButtonContainer">
                    <img src="/Image/MainImage/kakaoLoginButton.png"></img>
                </div>
                <div id="googleButtonContainer">
                    <div id="customBtn" className="customGPlusSignIn">
                    <span className="icon"></span>
                    <span className="buttonText">로그인</span>
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