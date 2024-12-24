import "./mainPage.css";
import React, {useEffect, useRef, useState} from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import MainFirst from './SlideComponent/pageFirst';
import MainSecond from './SlideComponent/pageSecond';
import MainThird from './SlideComponent/pageThird';
import MainFourth from './SlideComponent/pageFourth';
import MainFifth from './SlideComponent/pageFifth';
import MainLeft from './CommonComponent/Box/leftBox';
import MainTop from './CommonComponent/Box/topBox';
import MainBottom from './CommonComponent/Box/bottomBox';
import MenuModal from './ModalComponent/menuModal';
import LoginModal from './ModalComponent/loginModal';
import { useUserContext } from "../Context/userContext";
import { useConfig } from "../Context/configContext";
import { useAuthContext } from "../Context/authContext";

const MainPage = () => {
    const outerDivRef = useRef();
    const location = useLocation();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const [slideCheck, setSlideCheck] = useState(true);
    const [menuModal, setMenuModal] = useState(false);
    const [loginModal, setLoginModal] = useState(false);
    const [loginToFind, setLoginToFind] = useState(false);
    const [idPwBox, setIdPwBox] = useState(false);
    const [checkPwd, setCheckPwd] = useState("");
    const [diffCheck, setDiffCheck] = useState(false);
    const [topTxt, setTopTxt] = useState("재료 준비부터\n만드는 법, 조리시간");
    const [bottomTxt, setBottomTxt] = useState("한식부터 일식, 양식까지\n다양하게");
    const { setUserInfo } = useUserContext();
    const { serverUrl } = useConfig();
    const { setIsLogin } = useAuthContext();
    const scrollEventFlag = useRef(false);
    const pageHeight = window.innerHeight;

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
        setUserInfo({
            id: "",
            name: "",
            pwd: "",
            nickName: "",
            tel: ""
        });
        setCheckPwd("");
        setDiffCheck(false);

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

            // state 초기화
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

    const toggleMenuModal = () => {
        setMenuModal((prev) => !prev);
    };

    const toggleLoginModal = () => {
        setLoginModal((prev) => !prev);
    }

    const goToJoinBox = () => {
        setLoginModal((prev) => !prev);
        setCurrentPage(4);
    }

    const goToTopSlide = () => {
        setCurrentPage(0)
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
    
    return (
        <div ref={outerDivRef}>
            <MainFirst/>
            <MainSecond/>
            <MainThird/>
            <MainFourth/>
            <MainFifth toggleLoginModal={toggleLoginModal} goToTopSlide={goToTopSlide} checkPwd={checkPwd} setCheckPwd={setCheckPwd} diffCheck={diffCheck} setDiffCheck={setDiffCheck}/>
            <LoginModal toggleFindIdPw={toggleFindIdPw} idPwBox={idPwBox} loginToFind={loginToFind} loginModal={loginModal} toggleFindBox={toggleFindBox} toggleLoginModal={toggleLoginModal} goToJoinBox={goToJoinBox}/>
            <MenuModal menuModal={menuModal}/>
            {slideCheck  && <MainLeft  goToTopSlide={goToTopSlide} toggleMenuModal={toggleMenuModal} toggleLoginModal={toggleLoginModal} menuModal={menuModal}/>}
            {slideCheck  && <MainTop topTxt={topTxt}/>}
            {slideCheck  && <MainBottom bottomTxt={bottomTxt}/>}
        </div>);

}

export default MainPage;


