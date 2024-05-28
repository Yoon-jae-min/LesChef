import React from 'react';
import FirstVideo from '../../src/Video/mainFirstVideo.mp4'

const MainFirst = () => {
    return (
        <section className='mainSection'>
            <video muted autoPlay loop id='mainVideo'>
                <source src={FirstVideo} type="video/mp4"></source>
            </video>
        </section>
    )
}

export default MainFirst;