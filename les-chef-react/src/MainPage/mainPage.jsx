import React, {useEffect, useRef} from 'react';
import MainFirst from './mainPageFirst';
import MainSecond from './mainPageSecond';
import MainThird from './mainPageThird';
import MainFourth from './mainPageFourth';
import MainFifth from './mainPageFifth';

const MainPage = () => {

    const outerDivRef = useRef();
    let scrollEventFlag = false;

    useEffect(() => {
        const wheelHandler = (e) => {

            if(scrollEventFlag){
                return;
            }

            scrollEventFlag = true;
            
            const { deltaY } = e;
            let scrollTop = window.scrollY; 
            const pageHeight = window.innerHeight;
            let currentPage = Math.round(scrollTop / pageHeight);
        
            if (deltaY > 0) {
                if(currentPage < 4){
                    currentPage += 1;
                }
            } else {
                if(currentPage > 0){
                    currentPage -= 1;
                }
            }
            
            window.scrollTo({
                top: currentPage * pageHeight,
                left: 0,
                behavior: "smooth",
            });
            setTimeout(() => {
                scrollEventFlag = false;
            }, 500);
            
        };

        window.addEventListener("wheel", wheelHandler);
        return () => {
            window.removeEventListener("wheel", wheelHandler);
        };
        }, []);
    
    return (
        <div ref={outerDivRef}>
            <MainFirst/>
            <MainSecond/>
            <MainThird/>
            <MainFourth/>
            <MainFifth/>
        </div>);
}

export default MainPage;