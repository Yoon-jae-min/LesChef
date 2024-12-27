//기타
import React from 'react';

//컨텍스트
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