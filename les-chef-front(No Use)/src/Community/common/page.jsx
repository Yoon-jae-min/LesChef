//r기타
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//CSS
import styles from "../../CSS/community/common/page.module.css";

//컨텍스트
import { useConfig } from "../../Context/config";
import { BoardProvider } from "../../Context/board";
import { useUserContext } from "../../Context/user";

//컴포넌트
import CommunityBox from "../show/common/box";
import IconBox from "./iconBox";
import LoginModal from "../../Main/modal/login/modal";

const CommunityPage = () => {
    const {serverUrl} = useConfig();

    //로그인 관련
    const [idPwBox, setIdPwBox] = useState(false);
    const [loginToFind, setLoginToFind] = useState(false);
    const [loginModal, setLoginModal] = useState(false);
    const navigate = useNavigate();
    const {authCheck} = useUserContext();

    useEffect(() => {
        const userCheck = async() => {
            await authCheck();
        }

        userCheck();
    },[]);

    const toggleLoginModal = async() => {
        if(!await authCheck()){
            setLoginModal((prev) => !prev);
        }
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

    const switchFindToLogin = () => {
        setLoginToFind((prev) => !prev);
        setLoginModal(true);
    }

    return(
        <BoardProvider>
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
                    goToJoinBox={goToJoinBox}
                    setLoginModal={setLoginModal}
                    switchFindToLogin={switchFindToLogin}
                    pageInfo="community"/>
            </div>
        </BoardProvider>
    )
}

export default CommunityPage;