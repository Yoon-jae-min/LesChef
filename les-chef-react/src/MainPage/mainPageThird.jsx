import React from 'react';
import ThirdBg from '../Image/Background/mainThirdBg.png'

const MainThird = () => {
    return (
        <section className='mainSection'>
            <img src={ThirdBg}/>
            <p className='topText'>게시판에서<br/>자신의 레시피를</p>
            <p className='bottomText'>다른사람들과 함께<br/>공유해 보세요!</p>
        </section>
    )
}

export default MainThird;