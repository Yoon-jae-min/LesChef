import React from 'react';
import { useConfig } from '../../Context/configContext';

const MainSecond = () => {
    const { serverUrl }  = useConfig();

    return (
        <section className='mainSection'>
            <img src={`${serverUrl}/Image/MainImage/Background/mainSecondBg.png`} className='mainBgImg'/>
        </section>
    )
};

export default MainSecond;