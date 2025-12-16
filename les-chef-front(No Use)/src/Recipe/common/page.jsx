//기타
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//CSS
import styles from "../../CSS/recipe/common/page.module.css";

//컨텍스트
import { useConfig } from "../../Context/config";
import { useUserContext } from "../../Context/user";

//컴포넌트
import Show from "../show/common/box";
import Menu from "../menu/box";
import Icon from "./iconBox";
import LoginModal from "../../Main/modal/login/modal";

const RecipePage = () => {
    const [category, setCategory] = useState(localStorage.getItem("selectedCategory") || "korean");
    const [infoGoto, setInfoGoto] = useState(false);
    const navigate = useNavigate();
    const { serverUrl } = useConfig();
    const {authCheck} = useUserContext();

    useEffect(() => {
        const asyncMethod = async () => {
            await authCheck();
        };
    
        asyncMethod(); 
    },[]);

    //로그인 관련
    const [idPwBox, setIdPwBox] = useState(false);
    const [loginToFind, setLoginToFind] = useState(false);
    const [loginModal, setLoginModal] = useState(false);

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
        <div className={styles.body}>
            <img 
                src={`${serverUrl}/Image/RecipeImage/Background/recipeBackground.jpg`} 
                className={styles.bgImg}/>
            <Icon
                toggleLoginModal={toggleLoginModal}/>
            <Menu
                setCategory={setCategory} 
                setInfoGoto={setInfoGoto}/>
            <Show
                category={category} 
                infoGoto={infoGoto} 
                setInfoGoto={setInfoGoto}/>
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
                pageInfo="recipe"/>
        </div>
    )
}

export default RecipePage;