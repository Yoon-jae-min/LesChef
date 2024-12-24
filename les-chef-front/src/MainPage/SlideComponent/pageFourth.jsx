import React from 'react';
import { useConfig } from '../../Context/configContext';

const MainFourth = () => {
    const { serverUrl } = useConfig();

    return (
        <section className='mainSection'>
            <img src={`${serverUrl}/Image/MainImage/Background/mainFourthBg.png`} className='mainBgImg'/>
        </section>
    )
}

export default MainFourth;