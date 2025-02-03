//기타
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//CSS
import styles from "../../../../CSS/customer/show/info/contentBox/checkBox.module.css";

//컨텍스트
import { useUserContext } from "../../../../Context/user";
import { useConfig } from "../../../../Context/config";

const CheckBox = (props) => {
    const {setCheckPwd, setWdBox, setChgPwdBox, setChgInfoBox, checkContent} = props
    const {authCheck} = useUserContext();
    const {serverUrl} = useConfig();
    const navigate = useNavigate();
    const [chkPwdValue, setChkPwdValue] = useState("");

    const checkOk = async() => {
        const password = document.querySelector('.checkPwd').value;

        if(password === ''){
            alert('패스워드를 입력해주세요');
            return
        }

        if(await authCheck()){
            fetch(`${serverUrl}/customer/check`,{
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    password: password
                }),
                credentials: "include"
            }).then(async response => {
                if(!response.ok){
                    const errorData = await response.json();
                    throw new Error(errorData);
                }
                return response.json();
            }).then(data => {
                if(data.result){
                    if(checkContent === "withDraw"){
                        setWdBox((prev) => (!prev));
                        setCheckPwd((prev) => (!prev));
                    }else if(checkContent === "password"){
                        setChgPwdBox((prev) => (!prev));
                        setCheckPwd((prev) => (!prev));
                    }else if(checkContent === "inform"){
                        setChgInfoBox((prev) => (!prev));
                        setCheckPwd((prev) => (!prev));
                    }
                }else{
                    alert("비밀번호가 다릅니다");
                    setChkPwdValue("");
                }
            }).catch(err => {
                console.log(err.message);
                alert('다시 시도해주세요');
                window.location.reload();
            });
        }else{
            alert("다시 로그인해 주세요");
            navigate("/");
        }
    }

    const enterCheckOk = (e) => {
        if(e.key === 'Enter'){
            checkOk();
        }
    }

    const checkCancel = () => {
        setCheckPwd((prev) => (!prev));
    }

    const pwdValueChg = (pwd) => {
        setChkPwdValue(pwd);
    }

    return(
        <div className={styles.body}>
            <div className={styles.checkBox}>
                <p className={styles.chkLabel}>비밀번호</p>
                <input onChange={(e) => pwdValueChg(e.target.value)} onKeyDown={(e) => enterCheckOk(e)} value={chkPwdValue} type="password" className={`${styles.chkInput} checkPwd`}/>
            </div>
            <div className={styles.btnBox}>
                <button onClick={checkOk} type="button" className={styles.checkOk}>확인</button>
                <button onClick={checkCancel} type="button" className={styles.checkCancel}>취소</button>
            </div>
        </div>
        
    )
}

export default CheckBox;