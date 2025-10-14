//기타
import React from 'react';

//CSS
import section from "../../../CSS/main/section/section.module.css";
import first from "../../../CSS/main/section/first.module.css";

//컨텍스트
import { useConfig } from '../../../Context/config';

const MainFirst = (props) => {
    const { serverUrl } = useConfig();

    return (
        <section className={section.section}>
            <video muted autoPlay loop className={first.video}>
                <source src={`${serverUrl}/Video/mainFirstVideo.mp4`} type="video/mp4"></source>
            </video>
        </section>
    )
}

export default MainFirst;