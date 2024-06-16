import React from 'react';
import FifthBg from '../../Image/MainImage/Background/mainFifthBg.png'
import JoinBox from '../LoginElement/mainJoinBox';

const MainFifth = (props) => {
    const {toggleLoginModal} = props;

    return (
        <section className='mainSection lastSection'>
            <img src={FifthBg} className='mainBgImg'/>
            <JoinBox toggleLoginModal={toggleLoginModal}/>
        </section>
    )
}

export default MainFifth;