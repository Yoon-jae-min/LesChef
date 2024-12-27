//기타
import React from 'react';

//컨텍스트
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