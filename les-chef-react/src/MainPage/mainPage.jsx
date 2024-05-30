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
    let scrollEventFlag = false;
    const [slideCheck, setSlideCheck] = useState(true);
    useEffect(() => {
        const scrollHandler = (e) => {

            if(scrollEventFlag){
                return;
            }

            scrollEventFlag = true;
            
            // const { deltaY } = e;
            const scrollTop = window.scrollY
            const pageHeight = window.innerHeight;
            const currentPage = Math.round(scrollTop / pageHeight);
        
            // if (deltaY > 0) {
            //     if(currentPage < 4){
            //         currentPage += 1;
            //     }
            // } else {
            //     if(currentPage > 0){
            //         currentPage -= 1;
            //     }
            // }
            window.scrollTo({
                top: currentPage * pageHeight,
                left: 0,
                behavior: "smooth",
            });

            // if(window.scrollY >= 3 * pageHeight){
            //     setSlideCheck(false);
            // }else{
            //     setSlideCheck(true);
            // }
            

            setTimeout(() => {
                scrollEventFlag = false;
            }, 500);
            
        };

        window.addEventListener("scroll", scrollHandler);
        return () => {
            window.removeEventListener("scroll", scrollHandler);
        };
        }, []);
    
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


