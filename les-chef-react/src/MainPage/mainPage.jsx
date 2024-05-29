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
    const [ textContent, setTextContent ] = useState("firstText");
    const [slideIndex, setSlideIndex] = useState(0);

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

            setSlideIndex(currentPage);

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
            {slideIndex < 4 && <MainLeft/>}
            {slideIndex < 4 && <MainTop/>}
            {slideIndex < 4 && <MainBottom/>}
        </div>);

}



export default MainPage;


