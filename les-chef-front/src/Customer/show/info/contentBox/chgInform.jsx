//기타
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//CSS
import styles from "../../../../CSS/customer/show/info/contentBox/chgInform.module.css";

//컨텍스트
import { useUserContext } from "../../../../Context/user";
import {useConfig} from "../../../../Context/config";

const ChgInform = (props) => {
    const {setChgInfoBox, userData} = props;
    const navigate = useNavigate();
    const {authCheck} = useUserContext();
    const {serverUrl} = useConfig();
    const [preNickName, setPreNickName] = useState(userData.nickName);
    const [preTelNum, setPreTelNum] = useState(userData.tel);

    const confirmCheck = () => {
        return window.confirm("정말 변경하시겠습니까?");
    }

    const clickChg = async() => {
        if(!confirmCheck()){
            return;
        }

        if(await authCheck()){
            fetch(`${serverUrl}/customer/info`, {
                method: "PATCH",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    nickName: preNickName,
                    tel: preTelNum
                }),
                credentials: "include"
            }).then(response => {
                if(!response.ok){
                    throw new Error("error");
                }
                return response.json();
            }).then(data => {
                if(data.result){
                    const userData = JSON.parse(sessionStorage.getItem("userData"));
                    if (userData) {
                        userData.nickName = preNickName;
                        userData.tel = preTelNum;
                        sessionStorage.setItem("userData", JSON.stringify(userData));
                    }
                }
                window.location.reload();
            }).catch(err => {
                console.log(err);
                alert("다시 시도해 주세요");
                window.location.reload();
            })
        }else{
            alert("다시 로그인해 주세요");
            navigate("/");
        }
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
        let numericValue = value.replace(/[^0-9]/g, "");
        
        if (numericValue.length > 11) {
            numericValue = numericValue.slice(0, 11);
        }

        numericValue = numericValue.replace((numericValue.length <= 10) ? 
            /(\d{3})(\d{0,3})(\d{0,4})/ : /(\d{3})(\d{0,4})(\d{0,4})/,
            (match, p1, p2, p3) => { 
                if (numericValue.length <= 10) {
                    p2 = p2.slice(0, 3);
                    p3 = p3.slice(0, 4);
                }else{
                    p2 = p2.slice(0, 4);
                    p3 = p3.slice(0, 4);
                }
                return [p1, p2, p3].filter(Boolean).join("-");
            }
        );


        setPreTelNum(numericValue);
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