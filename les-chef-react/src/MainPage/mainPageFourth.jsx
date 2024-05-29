import React from 'react';
import FourthBg from '../Image/Background/mainFourthBg.png'

const MainFourth = () => {
    return (
        <section className='mainSection'>
            <img src={FourthBg}/>
            <p className='topText'>검색 기능으로<br/>남은재료를 입력해</p>
            <p className='bottomText'>색다른 방법으로<br/>음식을 만들어보세요!</p>
        </section>
    )
}

export default MainFourth;