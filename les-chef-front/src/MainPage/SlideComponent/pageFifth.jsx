import React from 'react';
import JoinBox from '../LoginComponent/joinBox';
import { useConfig } from '../../Context/configContext';

const MainFifth = (props) => {
    const {toggleLoginModal, goToTopSlide, checkPwd, setCheckPwd, diffCheck, setDiffCheck, dupliCheck, setDupliCheck} = props;
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