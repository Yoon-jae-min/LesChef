//기타
import React, { useEffect } from "react";

//CSS
import styles from "../../../CSS/main/modal/find.module.css";

//컨텍스트
import { useConfig } from "../../../Context/config";

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

    const HandlerSwitch = (text) => {
        const idButton = document.querySelector('.idClick');
        const pwButton = document.querySelector('.pwClick');

        if(text === "아이디"){
            if(pwButton.classList.contains(`${styles.click}`)){
                idButton.classList.add(`${styles.click}`);
                pwButton.classList.remove(`${styles.click}`);
                toggleFindIdPw();
            }
        }else{
            if(idButton.classList.contains(`${styles.click}`)){
                idButton.classList.remove(`${styles.click}`);
                pwButton.classList.add(`${styles.click}`);
                toggleFindIdPw();
            }
        }
    }

    return(
        <div className={`${styles.box} loginBox`} style={{opacity: loginToFind ? '1' : '0'}}>
            <img className={styles.logo} src={`${serverUrl}/Image/CommonImage/LogoWhite.png`}/>
            <div className={styles.idPwBtnBox}>
                <div className={`${styles.idBtn} ${styles.click} idClick`} onClick={(e) => HandlerSwitch(e.target.textContent)}>아이디</div>
                <div className={`${styles.pwBtn} pwClick`} onClick={(e) => HandlerSwitch(e.target.textContent)}>비밀번호</div>
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