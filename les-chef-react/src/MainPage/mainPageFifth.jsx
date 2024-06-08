import React from 'react';
import FifthBg from '../Image/Background/mainFifthBg.png'
import JoinBox from './LoginElement/mainJoinBox';

const MainFifth = (props) => {
    const {toggleLoginModal} = props;

    return (
        <section className='mainSection lastSection'>
            <img src={FifthBg}/>
            <JoinBox toggleLoginModal={toggleLoginModal}/>
        </section>
    )
}

export default MainFifth;