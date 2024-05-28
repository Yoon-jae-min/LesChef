import React from 'react';
import FirstVideo from '../../src/Video/mainFirstVideo.mp4'

const MainFirst = () => {
    return (
        <section className='mainSection'>
            <video muted autoPlay loop id='mainVideo' src={FirstVideo} type="video/mp4">
            </video>
        </section>
    )
}

export default MainFirst;