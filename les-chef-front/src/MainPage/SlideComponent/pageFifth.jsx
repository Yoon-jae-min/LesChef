import React from 'react';
import JoinBox from '../LoginComponent/joinBox';

const MainFifth = (props) => {
    const {toggleLoginModal, goToTopSlide, checkPwd, setCheckPwd, diffCheck, setDiffCheck} = props;

    return (
            <section className='mainSection lastSection'>
                <img src="/Image/MainImage/Background/mainFifthBg.png" className='mainBgImg'/>
                <JoinBox toggleLoginModal={toggleLoginModal} goToTopSlide={goToTopSlide} checkPwd={checkPwd} setCheckPwd={setCheckPwd} diffCheck={diffCheck} setDiffCheck={setDiffCheck}/>
            </section>
    )
}

export default MainFifth;