import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./recipePage.css";
import RecipeShowBox from "./ShowComponent/box";
import RecipeMenuBox from "./MenuComponent/box";
import IconBox from "./iconBox";
import LoginModal from "../MainPage/ModalComponent/loginModal";
import { useConfig } from "../Context/configContext";

const RecipePage = () => {
    const location = useLocation();
    const [category, setCategory] = useState('korean');
    const [infoGoto, setInfoGoto] = useState(false);
    const navigate = useNavigate();
    const { serverUrl } = useConfig();

    useEffect(() => {
        setCategory(location.state.category);
        let recipeListUrl = "";

        switch (category) {
            case 'korean':
                recipeListUrl = '/koreanList';
                break;
            case 'japanese':
                recipeListUrl = '/japaneseList';
                break;
            case 'chinese':
                recipeListUrl = '/chineseList';
                break;
            case 'western':
                recipeListUrl = '/westernList';
                break;
            case 'share':
                recipeListUrl = '/shareList';
                break;
        }

        fetch(`${serverUrl}/recipe${recipeListUrl}`).then((response) => {

        }).catch(err => console.log(err));
    },[]);

    //로그인 관련
    const [idPwBox, setIdPwBox] = useState(false);
    const [loginToFind, setLoginToFind] = useState(false);
    const [loginModal, setLoginModal] = useState(false);

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
        <div className="recipeBody">
            <img src={`${serverUrl}/Image/RecipeImage/Background/recipeBackground.jpg`} className="recipeBgImg"/>
            <IconBox toggleLoginModal={toggleLoginModal}/>
            <RecipeMenuBox setCategory={setCategory} setInfoGoto={setInfoGoto}/>
            <RecipeShowBox category={category} infoGoto={infoGoto} setInfoGoto={setInfoGoto}/>
            <LoginModal toggleFindIdPw={toggleFindIdPw} idPwBox={idPwBox} loginToFind={loginToFind} loginModal={loginModal} toggleFindBox={toggleFindBox} toggleLoginModal={toggleLoginModal} goToJoinBox={goToJoinBox}/>
        </div>
    )
}

export default RecipePage;