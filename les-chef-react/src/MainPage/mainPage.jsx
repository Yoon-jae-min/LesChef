import React, {useEffect, useRef, useState} from 'react';
import MainFirst from './mainPageFirst';
import MainSecond from './mainPageSecond';
import MainThird from './mainPageThird';
import MainFourth from './mainPageFourth';
import MainFifth from './mainPageFifth';
import MainLeft from './MainElement/mainLeftBox';
import MainTop from './MainElement/mainTopBox';
import MainBottom from './MainElement/mainBottomBox';

const MainPage = () => {
    const outerDivRef = useRef();
    const [currentPage, setCurrentPage] = useState(0);
    const [slideCheck, setSlideCheck] = useState(true);
    const scrollEventFlag = useRef(false);
    const pageHeight = window.innerHeight;

    const scrollHandler = (e) => {
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
    };

    useEffect(() => {

        window.addEventListener("wheel", scrollHandler, {passive: false});
        return () => {
            window.removeEventListener("wheel", scrollHandler);
        };
    }, []);

    useEffect(() => {
        window.scrollTo({
            top: currentPage * pageHeight,
            left: 0,
            behavior: "smooth",
        });
        setSlideCheck(currentPage < 4);
    }, [currentPage]);

    
    return (
        <div ref={outerDivRef}>
            <MainFirst/>
            <MainSecond/>
            <MainThird/>
            <MainFourth/>
            <MainFifth/>
            {slideCheck  && <MainLeft/>}
            {slideCheck  && <MainTop/>}
            {slideCheck  && <MainBottom/>}
        </div>);

}



export default MainPage;


