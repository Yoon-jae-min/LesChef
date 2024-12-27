//기타
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//CSS
import "../CSS/recipePage.css";

//컨텍스트
import { useConfig } from "../Context/configContext";
import { useRecipeContext } from "../Context/recipeContext";

//컴포넌트
import RecipeShowBox from "./ShowComponent/box";
import RecipeMenuBox from "./MenuComponent/box";
import IconBox from "./iconBox";
import LoginModal from "../MainPage/ModalComponent/loginModal";

const RecipePage = () => {
    const [category, setCategory] = useState(localStorage.getItem("selectedCategory") || "korean");
    const [infoGoto, setInfoGoto] = useState(false);
    const navigate = useNavigate();
    const { serverUrl } = useConfig();
    const { setRecipeList } = useRecipeContext();

    useEffect(() => {
        setRecipeList([]);
        const recipeListUrl = selectRecipeListUrl(category);
        recipeListSearch(recipeListUrl);
    },[]);

    useEffect(() => {
        console.log("test");
        setRecipeList([]);
        const recipeListUrl = selectRecipeListUrl(category);
        recipeListSearch(recipeListUrl);
    }, [category])

    //레시피 리스트 조회
    const recipeListSearch = (recipeListUrl) => {
        fetch(`${serverUrl}/recipe${recipeListUrl}`).then((response) => {
            return response.json();
        }).then((data) => {
            setRecipeList(data);
            setInfoGoto(false);
        }).catch(err => console.log(err));
    }

    //레시피 리스트 카테고리 URL 선택
    const selectRecipeListUrl = (category) => {
        console.log(category);
        switch (category) {
            case 'korean':
                return '/koreanList';
            case 'japanese':
                return '/japaneseList';
            case 'chinese':
                return '/chineseList';
            case 'western':
                return '/westernList';
            case 'share':
                return '/shareList';
        }
    }

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
            <img 
                src={`${serverUrl}/Image/RecipeImage/Background/recipeBackground.jpg`} 
                className="recipeBgImg"/>
            <IconBox 
                toggleLoginModal={toggleLoginModal}/>
            <RecipeMenuBox 
                setCategory={setCategory} 
                setInfoGoto={setInfoGoto}/>
            <RecipeShowBox 
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
                goToJoinBox={goToJoinBox}/>
        </div>
    )
}

export default RecipePage;