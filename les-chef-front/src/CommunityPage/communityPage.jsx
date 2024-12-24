import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./communityPage.css"
import CommunityBox from "./CommonElement/box";
import IconBox from "./iconBox";
import LoginModal from "../MainPage/ModalComponent/loginModal";
import { useConfig } from "../Context/configContext";

const CommunityPage = () => {
    const {serverUrl} = useConfig();

    //로그인 관련
    const [idPwBox, setIdPwBox] = useState(false);
    const [loginToFind, setLoginToFind] = useState(false);
    const [loginModal, setLoginModal] = useState(false);
    const navigate = useNavigate();

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
        <div className="communityMain">
            <img src={`${serverUrl}/Image/CommunityImage/Background/communityBackground.jpg`} className="communityBgImg"/>
            <IconBox toggleLoginModal={toggleLoginModal}/>
            <CommunityBox/>
            <LoginModal toggleFindIdPw={toggleFindIdPw} idPwBox={idPwBox} loginToFind={loginToFind} loginModal={loginModal} toggleFindBox={toggleFindBox} toggleLoginModal={toggleLoginModal} goToJoinBox={goToJoinBox}/>
        </div>
    )
}

export default CommunityPage;