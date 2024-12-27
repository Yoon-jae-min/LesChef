//기타
import React from 'react';

//컨텍스트
import { useConfig } from '../../Context/configContext';

//컴포넌트
import JoinBox from '../LoginComponent/joinBox';


const MainFifth = (props) => {
    const { toggleLoginModal, 
            goToTopSlide, 
            checkPwd, 
            setCheckPwd, 
            diffCheck, 
            setDiffCheck, 
            dupliCheck, 
            setDupliCheck} = props;
    const { serverUrl } = useConfig();

    return (
            <section className='mainSection lastSection'>
                <img src={`${serverUrl}/Image/MainImage/Background/mainFifthBg.png`} className='mainBgImg'/>
                <JoinBox 
                    toggleLoginModal={toggleLoginModal} 
                    goToTopSlide={goToTopSlide} 
                    checkPwd={checkPwd} 
                    setCheckPwd={setCheckPwd} 
                    diffCheck={diffCheck} 
                    setDiffCheck={setDiffCheck}
                    dupliCheck={dupliCheck}
                    setDupliCheck={setDupliCheck}/>
            </section>
    )
}

export default MainFifth;