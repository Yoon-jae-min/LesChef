//기타
import React from 'react';

//컨텍스트
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