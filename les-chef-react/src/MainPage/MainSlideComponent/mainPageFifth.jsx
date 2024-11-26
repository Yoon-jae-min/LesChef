import React from 'react';
import FifthBg from '../../Image/MainImage/Background/mainFifthBg.png'
import JoinBox from '../LoginElement/mainJoinBox';

const MainFifth = (props) => {
    const {toggleLoginModal, goToTopSlide} = props;

    return (
        <section className='mainSection lastSection'>
            <img src={FifthBg} className='mainBgImg'/>
            <JoinBox toggleLoginModal={toggleLoginModal} goToTopSlide={goToTopSlide}/>
        </section>
    )
}

export default MainFifth;