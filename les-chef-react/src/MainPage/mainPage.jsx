import React, {useEffect, useRef, useState} from 'react';
import MainFirst from './mainPageFirst';
import MainSecond from './mainPageSecond';
import MainThird from './mainPageThird';
import MainFourth from './mainPageFourth';
import MainFifth from './mainPageFifth';
import MainLeft from './MainElement/mainLeftBox';
import MainTop from './MainElement/mainTopBox';
import MainBottom from './MainElement/mainBottomBox';
import MenuModal from './mainMenuModal';
import LoginModal from './mainLoginModal';

const MainPage = () => {
    const outerDivRef = useRef();
    const [currentPage, setCurrentPage] = useState(0);
    const [slideCheck, setSlideCheck] = useState(true);
    const [menuModal, setMenuModal] = useState(false);
    const scrollEventFlag = useRef(false);
    const pageHeight = window.innerHeight;

    useEffect(() => {
        const scrollHandler = (e) => {
            if (!menuModal) {
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
    }, [menuModal]);

    useEffect(() => {
        window.scrollTo({
            top: currentPage * pageHeight,
            left: 0,
            behavior: "smooth",
        });
        setSlideCheck(currentPage < 4);
    }, [currentPage]);

    useEffect(() => {
        if (menuModal) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'auto';
        }
    }, [menuModal]);

    const toggleMenuModal = () => {
        setMenuModal((prev) => !prev);
    };
    
    return (
        <div ref={outerDivRef}>
            <MainFirst/>
            <MainSecond/>
            <MainThird/>
            <MainFourth/>
            <MainFifth/>
            <MenuModal menuModal={menuModal}/>
            {slideCheck  && <MainLeft toggleMenuModal={toggleMenuModal} menuModal={menuModal}/>}
            {slideCheck  && <MainTop/>}
            {slideCheck  && <MainBottom/>}
        </div>);

}

export default MainPage;


