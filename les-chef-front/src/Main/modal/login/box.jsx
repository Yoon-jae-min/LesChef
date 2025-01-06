//기타
import React, { useEffect, useState } from "react";

//CSS
import styles from "../../../CSS/main/modal/login.module.css";

//컨텍스트
import { useConfig } from '../../../Context/configContext.jsx';
import { useAuthContext } from "../../../Context/authContext.jsx";

//컴포넌트
import LoginInput from "./inputBox.jsx";


const LoginBox = (props) => {
    const { loginModal, 
            goToJoinBox,
            goToTopSlide, 
            toggleFindBox, 
            toggleLoginModal } = props;
    const [ customerId, setCustomerId ] = useState("");
    const [ customerPwd, setCustomerPwd ] = useState("");
    const { serverUrl } = useConfig();
    const { setIsLogin } = useAuthContext();

    const clickLogo = () => {
        goToTopSlide();
    }

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
        <div className={`${styles.box} loginBox`} style={{opacity: loginModal ? '1' : '0'}}>
            <img onClick={clickLogo} className={styles.logo} src={`${serverUrl}/Image/CommonImage/LogoWhite.png`}/>
            <LoginInput 
                inputId={inputId} 
                inputPwd={inputPwd} 
                idValue={customerId} 
                pwdValue={customerPwd}/>
            <p className={styles.findBtn} onClick={toggleFindBox}>아이디/비밀번호 찾기</p>
            <button className={styles.loginBtn} onClick={clickLogin}>로그인</button>
            <div className={styles.hrAndOr}>
                <hr className={styles.hr}/>
                <p className={styles.or}>or</p>
                <hr className={styles.hr}/>
            </div>
            <div className={styles.sns}>
                <div className={styles.kakao}>
                    <img src={`${serverUrl}/Image/MainImage/kakaoLoginButton.png`}></img>
                </div>
                <div className={`${styles.google} customGPlusSignIn`}>
                    <span className={styles.googleIcon}></span>
                    <span className={styles.snsText}>로그인</span>
                </div>
                <div className={styles.naver}>
                    <img className={styles.naverIcon} src={`${serverUrl}/Image/MainImage/naverIcon.png`}></img>
                    <span className={styles.snsText}>로그인</span>
                </div>
            </div>
            <div className={styles.joinBox}>
                <span>아직 회원이 아니신가요?</span>
                <span className={styles.joinBtn} onClick={goToJoinBox}>회원가입</span>
            </div>
        </div>
    )
}

export default LoginBox;