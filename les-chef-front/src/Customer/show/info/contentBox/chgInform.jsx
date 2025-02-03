//기타
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//CSS
import styles from "../../../../CSS/customer/show/info/contentBox/chgInform.module.css";

//컨텍스트
import { useUserContext } from "../../../../Context/user";

const ChgInform = (props) => {
    const {setChgInfoBox, userData} = props;
    const navigate = useNavigate();
    const {authCheck} = useUserContext();
    const [preNickName, setPreNickName] = useState(userData.nickName);
    const [preTelNum, setPreTelNum] = useState(userData.tel);

    const clickChg = () => {

    }

    const clickCancel = async() => {
        if(await authCheck()){
            setChgInfoBox((prev) => (!prev));
        }else{
            alert("다시 로그인해 주세요");
            navigate("/");
        }
    }

    const nickNameValue = (value) => {
        setPreNickName(value);
    }

    const telNumValue = (value) => {
        setPreTelNum(value);
    }

    return(
        <div className={styles.body}>
            <div className={styles.chgBox}>
                <div className={styles.chgInBox}>
                    <p className={styles.chgInfoLabel}>닉네임</p>
                    <input onChange={(e) => nickNameValue(e.target.value)} className={styles.chgInfoInput} type="text" value={preNickName}/>
                </div>
                <div className={styles.chgInBox}>
                    <p className={styles.chgInfoLabel}>전화번호</p>
                    <input onChange={(e) => telNumValue(e.target.value)} className={styles.chgInfoInput} type="text" value={preTelNum}/>
                </div>
            </div>
            <div className={styles.btnBox}>
                <button onClick={clickChg} className={styles.okBtn}>변경</button>
                <button onClick={clickCancel} className={styles.cancelBtn}>취소</button>
            </div>
        </div>
    )
}

export default ChgInform;