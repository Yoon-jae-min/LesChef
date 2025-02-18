//기타
import React from 'react';

//CSS
import section from "../../../CSS/main/section/section.module.css";
import fifth from "../../../CSS/main/section/fifth.module.css";

//컨텍스트
import { useConfig } from '../../../Context/config';

//컴포넌트
import JoinBox from './joinBox';

const MainFifth = (props) => {
        const { toggleLoginModal, 
                goToTopSlide, 
                checkPwd, 
                setCheckPwd, 
                diffCheck, 
                setDiffCheck, 
                dupliCheck, 
                setDupliCheck,
                currentPage } = props;
        const { serverUrl } = useConfig();

        return (
                <section className={`${section.section} ${fifth.section}`}>
                        <img src={`${serverUrl}/Image/MainImage/Background/mainFifthBg.png`} className={`${section.bgImg} ${fifth.bgImg}`}/>
                        <JoinBox 
                                toggleLoginModal={toggleLoginModal} 
                                goToTopSlide={goToTopSlide} 
                                checkPwd={checkPwd} 
                                setCheckPwd={setCheckPwd} 
                                diffCheck={diffCheck} 
                                setDiffCheck={setDiffCheck}
                                dupliCheck={dupliCheck}
                                setDupliCheck={setDupliCheck}
                                currentPage={currentPage}/>
                </section>
        )
}

export default MainFifth;