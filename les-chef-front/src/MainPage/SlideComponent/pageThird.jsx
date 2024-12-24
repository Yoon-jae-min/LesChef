import React from 'react';
import { useConfig } from '../../Context/configContext';

const MainThird = () => {
    const { serverUrl } = useConfig();

    return (
        <section className='mainSection'>
            <img src={`${serverUrl}/Image/MainImage/Background/mainThirdBg.png`} className='mainBgImg'/>
        </section>
    )
}

export default MainThird;