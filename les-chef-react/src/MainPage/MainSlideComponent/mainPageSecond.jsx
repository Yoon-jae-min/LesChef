import React from 'react';
import SecondBg from '../../Image/MainImage/Background/mainSecondBg.png'

const MainSecond = () => {
    return (
        <section className='mainSection'>
            <img src={SecondBg} className='mainBgImg'/>
            <p className='topText'>간단한<br/>아침 레시피부터</p>
            <p className='bottomText'>온 가족이 즐길수 있는<br/>저녁 레시피까지</p>
        </section>
    )
};

export default MainSecond;