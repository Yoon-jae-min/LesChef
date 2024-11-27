import React from 'react';
import JoinBox from '../LoginElement/mainJoinBox';

const MainFifth = (props) => {
    const {toggleLoginModal, goToTopSlide} = props;

    return (
        <section className='mainSection lastSection'>
            <img src="/Image/MainImage/Background/mainFifthBg.png" className='mainBgImg'/>
            <JoinBox toggleLoginModal={toggleLoginModal} goToTopSlide={goToTopSlide}/>
        </section>
    )
}

export default MainFifth;