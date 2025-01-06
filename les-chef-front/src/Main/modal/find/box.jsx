//기타
import React, { useEffect } from "react";

//컨텍스트
import { useConfig } from "../../../Context/configContext";

//CSS
import styles from "../../../CSS/main/modal/find.module.css";

//컴포넌트
import FindId from "./id";
import FindPw from "./pw";


const FindBox = (props) => {
    const { loginToFind, 
            toggleFindIdPw, 
            idPwBox,
            switchFindToLogin,
            toggleFindBox } = props;
    const { serverUrl } = useConfig();

    useEffect(() => {
        const idButton = document.querySelector('.idClick');
        const pwButton = document.querySelector('.pwClick');

        idButton.classList.add(`${styles.click}`);
        pwButton.classList.remove(`${styles.click}`);
    }, [])

    const HandlerSwitch = () => {
        const idButton = document.querySelector('.idClick');
        const pwButton = document.querySelector('.pwClick');

        if(idButton.classList.contains(`${styles.click}`)){
            idButton.classList.remove(`${styles.click}`);
            pwButton.classList.add(`${styles.click}`);
        }else{
            idButton.classList.add(`${styles.click}`);
            pwButton.classList.remove(`${styles.click}`);
        }
        toggleFindIdPw();
    }

    return(
        <div className={`${styles.box} loginBox`} style={{opacity: loginToFind ? '1' : '0'}}>
            <img className={styles.logo} src={`${serverUrl}/Image/CommonImage/LogoWhite.png`}/>
            <div className={styles.idPwBtnBox}>
                <div className={`${styles.idBtn} ${styles.click} idClick`} onClick={HandlerSwitch}>로그인</div>
                <div className={`${styles.pwBtn} pwClick`} onClick={HandlerSwitch}>비밀번호</div>
            </div>
            {!idPwBox && 
                <FindId 
                    idPwBox={idPwBox} switchFindToLogin={switchFindToLogin} toggleFindBox={toggleFindBox}/>}
            {idPwBox && 
                <FindPw 
                    idPwBox={idPwBox} switchFindToLogin={switchFindToLogin} toggleFindBox={toggleFindBox}/>}
        </div>
    )
}

export default FindBox;