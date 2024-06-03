import React from 'react';
import FifthBg from '../Image/Background/mainFifthBg.png'
import JoinBox from './MainElement/mainJoinBox';

const MainFifth = () => {
    return (
        <section className='mainSection lastSection'>
            <img src={FifthBg}/>
            <JoinBox/>
        </section>
    )
}

export default MainFifth;