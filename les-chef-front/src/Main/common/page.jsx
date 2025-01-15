//기타
import React, {useEffect, useRef, useState} from 'react';
import { useLocation, useNavigate } from "react-router-dom";

//컨텍스트
import { useUserContext } from "../../Context/user";
import { useRecipeContext } from '../../Context/recipe';

//컴포넌트
import MainFirst from '../Slide/first/box';
import MainSecond from '../Slide/second/box';
import MainThird from '../Slide/third/box';
import MainFourth from '../Slide/fourth/box';
import MainFifth from '../Slide/fifth/box';
import MainLeft from './left/box';
import MainTop from './right/top';
import MainBottom from './right/bottom';
import MenuModal from '../modal/menu/modal';
import LoginModal from '../modal/login/modal';


const MainPage = () => {
    const outerDivRef = useRef();
    const location = useLocation();
    const navigate = useNavigate();
    const {setRecipeList} = useRecipeContext();

    //페이지 관련
    const [currentPage, setCurrentPage] = useState(0);
    const [slideCheck, setSlideCheck] = useState(true);
    const [topTxt, setTopTxt] = useState("재료 준비부터\n만드는 법, 조리시간");
    const [bottomTxt, setBottomTxt] = useState("한식부터 일식, 양식까지\n다양하게");

    //메뉴 모달 관련
    const [menuModal, setMenuModal] = useState(false);

    //로그인 모달 관련 
    const [loginModal, setLoginModal] = useState(false);
    const [loginToFind, setLoginToFind] = useState(false);
    const [idPwBox, setIdPwBox] = useState(false);

    //회원 가입 관련
    const [checkPwd, setCheckPwd] = useState("");
    const [diffCheck, setDiffCheck] = useState(false);
    const [dupliCheck, setDupliCheck] = useState(false);

    const { authCheck } = useUserContext();
    const scrollEventFlag = useRef(false);
    const pageHeight = window.innerHeight;

    useEffect(() => {
        const userAuth = async () => {
            await authCheck();
        }

        userAuth();
    },[])

    useEffect(() => {
        if(loginModal){
            setIdPwBox(false);
        }
    }, [loginModal])

    useEffect(() => {
        const scrollHandler = (e) => {
            if (!menuModal && !loginModal) {
                e.preventDefault();
    
                if(scrollEventFlag.current){
                    return;
                }
    
                scrollEventFlag.current = true;
                
                const { deltaY } = e;
    
                if (deltaY > 0) {
                    setCurrentPage((prevPage) => (prevPage < 4 ? prevPage + 1 : prevPage));
                } else {
                    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : prevPage));
                }  
    
                setTimeout(() => {
                    scrollEventFlag.current = false;
                }, 500);
            }
        };
    
        window.addEventListener("wheel", scrollHandler, {passive: false});
    
        return () => {
            window.removeEventListener("wheel", scrollHandler);
        };
    }, [menuModal, loginModal]);

    useEffect(() => {
        window.scrollTo({
            top: currentPage * pageHeight,
            left: 0,
            behavior: "smooth",
        });
        setSlideCheck(currentPage < 4);
        setCheckPwd("");
        setDiffCheck(false);
        setDupliCheck(false);

        setTimeout(() => {
            switch (currentPage) {
                case 0:
                    setTopTxt("재료 준비부터\n만드는 법, 조리시간");
                    setBottomTxt("한식부터 일식, 양식까지\n다양하게");
                    break;
                case 1:
                    setTopTxt("간단한\n아침 레시피부터")
                    setBottomTxt("온 가족이 즐길수 있는\n저녁 레시피까지")
                    break;
                case 2:
                    setTopTxt("게시판에서\n자신의 레시피를");
                    setBottomTxt("다른사람들과 함께\n공유해 보세요!");
                    break;
                case 3:
                    setTopTxt("검색 기능으로\n남은재료를 입력해");
                    setBottomTxt("색다른 방법으로\n음식을 만들어보세요!");
                    break;
            }
        }, 100);
    }, [currentPage]);

    useEffect(() => {
        if (location.state?.currentPage !== undefined) {
            setCurrentPage(location.state.currentPage);

            navigate(location.pathname, { replace: true });
        }
    }, [location.state]);

    useEffect(() => {
        if (menuModal || loginModal) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'auto';
        }
    }, [menuModal, loginModal]);
    
    //페이지 이동 관련
    const goToTopSlide = () => {
        if(loginModal){
            setLoginModal((prev) => !prev);
        }
        setCurrentPage(0)
    }

    const goToJoinBox = () => {
        if(loginModal){
            setLoginModal((prev) => !prev);
        }
        setCurrentPage(4);
    }

    //메뉴 모달 관련
    const toggleMenuModal = () => {
        setMenuModal((prev) => !prev);
    }

    //로그인 모달 관련
    const toggleLoginModal = async() => {
        if(!await authCheck()){
            setLoginModal((prev) => !prev);
        }
    }

    const toggleFindBox = () => {
        setLoginToFind((prev) => !prev);
    }

    const toggleFindIdPw = () => {
        setIdPwBox((prev) => !prev);
        console.log(loginModal);
    }

    const switchFindToLogin = () => {
        setLoginToFind((prev) => !prev);
        setLoginModal(true);
    }
    
    return (
        <div ref={outerDivRef}>
            <MainFirst/>
            <MainSecond/>
            <MainThird/>
            <MainFourth/>
            <MainFifth 
                toggleLoginModal={toggleLoginModal} 
                goToTopSlide={goToTopSlide} 
                checkPwd={checkPwd} 
                setCheckPwd={setCheckPwd} 
                diffCheck={diffCheck} 
                setDiffCheck={setDiffCheck} 
                dupliCheck={dupliCheck}
                setDupliCheck={setDupliCheck}
                currentPage={currentPage}/>
            <LoginModal 
                idPwBox={idPwBox} 
                loginToFind={loginToFind}
                loginModal={loginModal} 
                setLoginModal={setLoginModal}
                toggleLoginModal={toggleLoginModal}
                toggleFindIdPw={toggleFindIdPw} 
                toggleFindBox={toggleFindBox} 
                goToJoinBox={goToJoinBox}
                goToTopSlide={goToTopSlide}
                switchFindToLogin={switchFindToLogin}/>
            <MenuModal menuModal={menuModal}/>
            {slideCheck  && 
                <MainLeft  
                    goToTopSlide={goToTopSlide} 
                    toggleMenuModal={toggleMenuModal} 
                    toggleLoginModal={toggleLoginModal} 
                    menuModal={menuModal}/>
            }
            {slideCheck  && <MainTop topTxt={topTxt}/>}
            {slideCheck  && <MainBottom bottomTxt={bottomTxt}/>}
        </div>);

}

export default MainPage;


