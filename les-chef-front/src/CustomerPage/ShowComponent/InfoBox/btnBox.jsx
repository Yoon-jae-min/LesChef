//기타
import React, { useState } from "react";

//CSS
import styles from "../../../CSS/customer/show/info/btnBox.module.css";

const Btn = (props) => {
    const [ changeInfo, setChangeInfo ] = useState(false);
    const { pwdChange,
            checkedPwd,
            deleteInfo,
            setPwdChange,
            setCheckedPwd,
            setDeleteInfo } = props;

    const changeInfoClick = () => {
        setChangeInfo(true);
        setPwdChange(false);
    }

    const changeInfoCancel = () => {
        setChangeInfo(false);
    }

    const changePwdClick = () => {
        setPwdChange(true);
        setChangeInfo(false);
    }

    const changePwdCancel = () => {
        setPwdChange(false);
        setCheckedPwd(false);
    }

    const deleteInfoClick = () => {
        setDeleteInfo(true);
    }

    const deleteInfoCancel = () => {
        setDeleteInfo(false);
        setCheckedPwd(false);
    }

    return(
        <div className={styles.btnBox}>
            { (!changeInfo && !pwdChange && !checkedPwd && !deleteInfo) && 
                <button 
                    onClick={deleteInfoClick} 
                    type="button" 
                    className={`customerDeleteBtn ${styles.btnUnit}`}>회원 탈퇴</button> }
            { (deleteInfo || checkedPwd) && 
                <button 
                    onClick={deleteInfoCancel} 
                    type="button" 
                    className={`customerpwdDelBtnCancel ${styles.btnUnit}`}>회원 탈퇴 취소</button> }
            { (!changeInfo && !pwdChange && !checkedPwd && !deleteInfo) && 
                <button 
                    onClick={changeInfoClick} 
                    type="button" 
                    className={`customerInfoChangeBtn ${styles.btnUnit}`}>회원정보 변경</button>}
            { changeInfo && 
                <button 
                    onClick={changeInfoCancel} 
                    type="button" 
                    className={`customerInfoCgBtnCancel ${styles.btnUnit}`}>회원정보 변경 취소</button>}
            { (!changeInfo && !pwdChange && !checkedPwd && !deleteInfo) && 
                <button 
                    onClick={changePwdClick} 
                    type="button" 
                    className={`customerpwdChangeBtn ${styles.btnUnit}`}>비밀번호 변경</button>}
            { (pwdChange || checkedPwd) && 
                <button 
                    onClick={changePwdCancel} 
                    type="button" 
                    className={`customerpwdCgBtnCancel ${styles.btnUnit}`}>비밀번호 변경 취소</button> }
        </div>
    )
}

export default Btn;