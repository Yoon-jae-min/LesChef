//기타
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//CSS
import styles from "../../../CSS/main/modal/login.module.css";

//컨텍스트
import { useConfig } from '../../../Context/config';
import { useUserContext } from "../../../Context/user";

//컴포넌트
import LoginInput from "./inputBox.jsx";


const LoginBox = (props) => {
    const { loginModal, 
            goToJoinBox,
            goToTopSlide, 
            toggleFindBox, 
            toggleLoginModal,
            setLoginModal,
            pageInfo } = props;
    const [ customerId, setCustomerId ] = useState("");
    const [ customerPwd, setCustomerPwd ] = useState("");
    const { serverUrl, kakaoApiKey } = useConfig();
    const { setIsLogin } = useUserContext();
    const navigate = useNavigate();

    const clickLogo = () => {
        console.log(pageInfo);
        if(pageInfo === "main"){
            goToTopSlide();
        }else{
            navigate('/');
        }
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
            }).then(response => response.json()).then((data) => {
                if(data.text === "login Success"){
                    sessionStorage.setItem('userData', JSON.stringify({
                        id: data.id,
                        name: data.name,
                        nickName: data.nickName,
                        tel: data.tel
                    }));
                    setIsLogin(true); 
                    setLoginModal(false);
                    alert("로그인 하셨습니다.");
                }else{
                    alert("로그인 실패");
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

    const googleLogin = () => {

    }

    const kakaoLogin = () => {
        window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoApiKey}&redirect_uri=${serverUrl}/customer/kakaoLogin&response_type=code`;
    }

    const naverLogin = () => {

    }

    return(
        <div className={`${styles.box} loginBox`} style={{opacity: loginModal ? '1' : '0'}}>
            <img onClick={clickLogo} className={styles.logo} src={`${serverUrl}/Image/CommonImage/LogoWhite.png`}/>
            <LoginInput 
                inputId={inputId} 
                inputPwd={inputPwd} 
                idValue={customerId} 
                pwdValue={customerPwd}
                clickLogin={clickLogin}/>
            <p className={styles.findBtn} onClick={toggleFindBox}>아이디/비밀번호 찾기</p>
            <button className={styles.loginBtn} onClick={clickLogin}>로그인</button>
            <div className={styles.hrAndOr}>
                <hr className={styles.hr}/>
                <p className={styles.or}>or</p>
                <hr className={styles.hr}/>
            </div>
            <div className={styles.sns}>
                <div className={styles.kakao}>
                    <img className={styles.kakaoIcon} src={`${serverUrl}/Image/MainImage/kakaoLoginButton.png`} onClick={kakaoLogin}/>
                </div>
                <div className={`${styles.google} customGPlusSignIn`}>
                    <img className={styles.googleIcon} src="https://developers.google.com/identity/sign-in/g-normal.png" onClick={googleLogin}/>
                </div>
                
                <div className={styles.naver}>
                    <img className={styles.naverIcon} src={`${serverUrl}/Image/MainImage/naverIcon.png`} onClick={naverLogin}/>
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