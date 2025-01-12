//기타
import React from 'react';

//CSS
import styles from "../../../CSS/main/section/section.module.css"

//컨텍스트
import { useConfig } from '../../../Context/config';

const MainThird = () => {
    const { serverUrl } = useConfig();

    return (
        <section className={styles.section}>
            <img src={`${serverUrl}/Image/MainImage/Background/mainThirdBg.png`} className={styles.bgImg}/>
        </section>
    )
}

export default MainThird;