import React from 'react';

const MainFirst = (props) => {

    return (
        <section className='mainSection'>
            <video muted autoPlay loop id='mainVideo'>
                <source src="/Video/mainFirstVideo.mp4" type="video/mp4"></source>
            </video>

            <p className='topText'>재료 준비부터<br/>만드는 법, 조리시간</p>
            <p className='bottomText'>한식부터 일식, 양식까지<br/>다양하게</p>
        </section>
    )
}

export default MainFirst;