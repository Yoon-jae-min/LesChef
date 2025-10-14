//기타
import React from "react";
import { useNavigate } from "react-router-dom";

//CSS
import styles from "../../../../CSS/customer/show/info/contentBox/chgPwd.module.css";

//컨텍스트
import { useUserContext } from "../../../../Context/user";

const ChgPwd = (props) => {
    const {setChgPwdBox, setNotice} = props;
    const {authCheck} = useUserContext();
    const navigate = useNavigate();

    const clickChg = () => {

    }

    const clickCancel = async() => {
        if(await authCheck()){
            setChgPwdBox((prev) => (!prev));
            setNotice((prev) => (!prev));
        }else{
            alert("다시 로그인해 주세요");
            navigate("/");
        }
    }

    return(
        <div className={styles.box}>
            <div className={styles.chgBox}>
                <div className={styles.chgInBox}>
                    <p className={styles.chgPwdLabel}>새 비밀번호</p>
                    <input className={styles.chgPwdInput} type="password"/>
                </div>
                <div  className={styles.chgInBox}>
                    <p className={styles.chgPwdLabel}>새 비밀번호 확인</p>
                    <input className={styles.chgPwdInput} type="password"/>
                </div>
            </div>
            <div className={styles.btnBox}>
                <button onClick={clickChg} className={styles.okBtn}>변경</button>
                <button onClick={clickCancel} className={styles.cancelBtn}>취소</button>
            </div>
        </div>
    )
}

export default ChgPwd