//r기타
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//CSS
import styles from "../../CSS/community/common/page.module.css";

//컨텍스트
import { useConfig } from "../../Context/configContext";
import { useAuthContext } from "../../Context/authContext";

//컴포넌트
import CommunityBox from "../show/common/box";
import IconBox from "./iconBox";
import LoginModal from "../../Main/modal/login/modal";

const CommunityPage = () => {
    const {serverUrl} = useConfig();
    const { setIsLogin } = useAuthContext();

    //로그인 관련
    const [idPwBox, setIdPwBox] = useState(false);
    const [loginToFind, setLoginToFind] = useState(false);
    const [loginModal, setLoginModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${serverUrl}/customer/auth`,{
            method: "GET",
            headers: { "Content-type": "application/json" },
            credentials: 'include'
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if(data.loggedIn){
                setIsLogin(true);
            }else{
                setIsLogin(false);
            }
        }).catch((err) => {
            console.log(err);
        })
    },[]);

    const toggleLoginModal = () => {
        setLoginModal((prev) => !prev);
    }

    const toggleFindBox = () => {
        setLoginToFind((prev) => !prev);
        if(loginModal){
            setLoginModal(false);
        }
    }

    const toggleFindIdPw = () => {
        setIdPwBox((prev) => !prev);
    }

    const goToJoinBox = () => {
        navigate("/", { state: { currentPage: 4 } });
    }

    return(
        <div className={styles.body}>
            <img src={`${serverUrl}/Image/CommunityImage/Background/communityBackground.jpg`} className={styles.bgImg}/>
            <IconBox toggleLoginModal={toggleLoginModal}/>
            <CommunityBox/>
            <LoginModal 
                toggleFindIdPw={toggleFindIdPw} 
                idPwBox={idPwBox} 
                loginToFind={loginToFind} 
                loginModal={loginModal} 
                toggleFindBox={toggleFindBox} 
                toggleLoginModal={toggleLoginModal} 
                goToJoinBox={goToJoinBox}/>
        </div>
    )
}

export default CommunityPage;