//기타
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//CSS
import styles from "../../../CSS/customer/show/info/btnBox.module.css";

//컨텍스트
import { useUserContext } from "../../../Context/user";

const Btn = (props) => {
    const [ changeInfo, setChangeInfo ] = useState(false);
    const { pwdChange,
            checkedPwd,
            deleteInfo,
            setPwdChange,
            setCheckedPwd,
            setDeleteInfo } = props;
    const {authCheck} = useUserContext();
    const navigate = useNavigate();

    const userCheck = async() => {
        return await authCheck();
    }

    const loginMessage = () => {
        alert('다시 로그인 해주세요');
        navigate('/');
    }

    const changeInfoClick = () => {
        if(userCheck()){
            setChangeInfo(true);
            setPwdChange(false);
        }else{
            loginMessage();
        }
    }

    const changeInfoCancel = () => {
        if(userCheck()){
            setChangeInfo(false);
        }else{
            loginMessage();
        }
    }

    const changePwdClick = () => {
        if(userCheck()){
            setPwdChange(true);
            setChangeInfo(false);
        }else{
            loginMessage();
        }
    }

    const changePwdCancel = () => {
        if(userCheck()){
            setPwdChange(false);
            setCheckedPwd(false);
        }else{
            loginMessage();
        }
    }

    const deleteInfoClick = () => {
        if(userCheck()){
            setDeleteInfo(true);
        }else{
            loginMessage();
        }
    }

    const deleteInfoCancel = () => {
        if(userCheck()){
            setDeleteInfo(false);
            setCheckedPwd(false);
        }else{
            loginMessage();
        }
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