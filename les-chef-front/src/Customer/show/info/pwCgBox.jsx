//기타
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//CSS
import styles from "../../../CSS/customer/show/info/pwCg.module.css";

//컨텍스트
import { useUserContext } from "../../../Context/user";

const PwCg = (props) => {
    const [ checkInputText, setCheckInputText ] = useState("");
    const { pwdChange,
            deleteInfo,
            checkedPwd,
            setPwdChange,
            setDeleteInfo,
            setCheckedPwd } = props;
    const {authCheck} = useUserContext();
    const navigate = useNavigate();

    const checkInputUpdate = (e) => {
        setCheckInputText(e.target.value);
    }

    const checkBtnClick = async() => {
        if(await authCheck()){
            if(checkInputText === "1234"){
                setCheckedPwd(true);
                setPwdChange(false);
                setDeleteInfo(false);
            }else{
                alert("비밀번호가 틀렸습니다.");
            }
            setCheckInputText("");
        }else{
            navigate('/');
        }
    }

    return(
        <div className={styles.body}>
            { pwdChange && <div className={styles.chkBox}>
                <p className={styles.chkLabel}>비밀번호</p>
                <input type="text" className={styles.chkInput} value={checkInputText} onChange={checkInputUpdate}/>
                <button onClick={checkBtnClick} type="button" className={styles.chkBtn}>확인</button>
            </div> }
            { deleteInfo && <div className={styles.chkBox}>
                <p className={styles.chkLabel}>비밀번호</p>
                <input type="text" className={styles.chkInput} value={checkInputText} onChange={checkInputUpdate}/>
                <button onClick={checkBtnClick} type="button" className={styles.chkBtn}>확인</button>
            </div> }
            { checkedPwd && <div className={styles.udtBox}>
                <div className={`passwordNewBox ${styles.udtInnerBox}`}>
                    <p className={`${styles.newLabel} ${styles.udtLabel}`}>새 비밀번호</p>
                    <input className={`passwordNewInput ${styles.udtInput}`}/>
                </div>
                <div className={`passwordNewCheckBox ${styles.udtInnerBox}`}>
                    <p className={`passwordNewCheckLabel ${styles.udtLabel}`}>새 비밀번호 확인</p>
                    <input className={`passwordNewCheckInput ${styles.udtInput}`}/>
                </div>
                <button className={styles.udtBtn}>변경</button>
            </div> }
        </div>
    )
}

export default PwCg;