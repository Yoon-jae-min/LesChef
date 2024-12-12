import "./mainPage.css";
import React, {useEffect, useRef, useState} from 'react';
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

const MainPage = () => {
    const outerDivRef = useRef();
    const [currentPage, setCurrentPage] = useState(0);
    const [slideCheck, setSlideCheck] = useState(true);
    const [menuModal, setMenuModal] = useState(false);
    const [loginModal, setLoginModal] = useState(false);
    const [loginToFind, setLoginToFind] = useState(false);
    const [idPwBox, setIdPwBox] = useState(false);
    const [ checkPwd, setCheckPwd ] = useState("");
    const [ diffCheck, setDiffCheck ] = useState(false);
    const { setUserInfo } = useUserContext();
    const scrollEventFlag = useRef(false);
    const pageHeight = window.innerHeight;

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
    }, [currentPage]);

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
            {slideCheck  && <MainTop/>}
            {slideCheck  && <MainBottom/>}
        </div>);

}

export default MainPage;


