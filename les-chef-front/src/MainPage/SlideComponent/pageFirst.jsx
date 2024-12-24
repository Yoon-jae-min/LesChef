import React from 'react';
import { useConfig } from '../../Context/configContext';

const MainFirst = (props) => {
    const { serverUrl } = useConfig();

    return (
        <section className='mainSection'>
            <video muted autoPlay loop id='mainVideo'>
                <source src={`${serverUrl}/Video/mainFirstVideo.mp4`} type="video/mp4"></source>
            </video>
        </section>
    )
}

export default MainFirst;