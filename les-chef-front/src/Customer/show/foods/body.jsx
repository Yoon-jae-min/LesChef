//기타
import React, { useState } from "react";

//CSS
import styles from "../../../CSS/customer/show/foods/foods.module.css";

//컨텍스트
import {useConfig} from "../../../Context/config";

//컴포넌트
import Section from "./section";

const Body = () => {
    const {serverUrl} = useConfig();
    const [placeInput, setPlaceInput] = useState(false);

    const preSectionAdd = () => {
        setPlaceInput(true);
    }

    const addCancel = () => {
        setPlaceInput(false);
    }

    return(
        <div className={styles.body}>
            <Section/>
            <div className={styles.plus}>
                {!placeInput && <img onClick={preSectionAdd} className={styles.plusImg} src={`${serverUrl}/Image/CommonImage/add.png`}/>}
                {placeInput && 
                    <div className={styles.placeBox}>
                        <input className={styles.placeInput} type="text" placeholder="보관 장소를 입력해주세요"/> 
                        <div className={styles.inputBtn}>
                            <img className={styles.okBtn} src={`${serverUrl}/Image/CommonImage/ok.png`}/>
                            <img onClick={addCancel} className={styles.cancelBtn} src={`${serverUrl}/Image/CommonImage/cancelRed.png`}/>   
                        </div>
                    </div>}

            </div>
        </div>
    )
}

export default Body;