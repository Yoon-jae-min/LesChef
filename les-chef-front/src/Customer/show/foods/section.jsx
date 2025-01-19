//기타
import React, { useState } from "react";

//CSS
import styles from "../../../CSS/customer/show/foods/section.module.css";

//컨텍스트
import { useConfig } from "../../../Context/config";

//컴포넌트
import Unit from "./unit";

const Section = () => {
    const {serverUrl} = useConfig();
    const [nameChange, setNameChange] = useState(false);

    const changeClick = () => {
        setNameChange((prev) => (!prev));
    }

    return(
        <div className={styles.box}>
            <div className={styles.head}>
                <p className={styles.nameBox}>냉장실</p>
                <div className={styles.btnBox}>
                    <img onClick={changeClick} className={styles.editBtn} src={`${serverUrl}/Image/CommonImage/edit.png`}/>
                    <img className={styles.deleteBtn} src={`${serverUrl}/Image/CommonImage/cancel.png`}/>
                </div>
            </div>

            <div className={styles.body}>
                <Unit/>
                <div className={styles.plusBox}>
                    <img className={styles.plusBtn} src={`${serverUrl}/Image/CommonImage/add.png`}/>
                </div>
            </div>

            { nameChange && 
                <div className={styles.changeBox}>
                    <div className={styles.changeInput}>
                        <input className={styles.nameInput} type="text" placeholder="보관 장소를 입력해주세요"/>
                        <div className={styles.changeBtnBox}>
                            <img className={styles.okBtn} src={`${serverUrl}/Image/CommonImage/ok.png`}/>
                            <img onClick={changeClick} className={styles.cancelBtn} src={`${serverUrl}/Image/CommonImage/cancelRed.png`}/>    
                        </div>    
                    </div>    
                </div>}
        </div>
    )
}

export default Section;