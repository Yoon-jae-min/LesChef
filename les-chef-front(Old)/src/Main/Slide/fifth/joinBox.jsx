//기타
import React, { useEffect, useState } from 'react';

//CSS
import styles from "../../../CSS/main/section/join.module.css";

//컨텍스트
import { useConfig } from '../../../Context/config';

//컴포넌트
import JoinInput from './joinInputBox.jsx';


const JoinBox = (props) => {
    const { toggleLoginModal, 
            goToTopSlide, 
            checkPwd, 
            setCheckPwd, 
            diffCheck, 
            setDiffCheck, 
            dupliCheck, 
            setDupliCheck,
            currentPage } = props;
    const [saveInfo, setSaveInfo] = useState({
            id: "",
            pwd: "",
            name: "",
            nickName: "",
            tel: ""
        });
    const { serverUrl } = useConfig();

    useEffect(() => {
        setSaveInfo({
            id: "",
            pwd: "",
            name: "",
            nickName: "",
            tel: ""
        })
    }, [currentPage]);

    const clickJoin = () => {
        if(saveInfo.id === ""){
            alert("아이디를 입력해주세요");
        }else if(saveInfo.name === ""){
            alert("이름을 입력해주세요");
        }else if(saveInfo.nickName === ""){
            alert("닉네임을 입력해주세요");
        }else if(saveInfo.tel.length < 10 && saveInfo.tel.length > 0){
            alert("전화번호를 제대로 입력해주세요");
        }else if(saveInfo.pwd === ""){
            alert("비밀번호를 입력해주세요");
        }else if(saveInfo.pwd !== checkPwd){
            alert("비밀번호를 확인해주세요");
        }else if(!dupliCheck){
            alert("아이디 중복 확인해주세요");
        }else{
            fetch(`${serverUrl}/customer/join`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(saveInfo)
            }).then((response) => {
                alert("회원가입이 완료되었습니다!!!");
                window.location.reload(true);
            });
        }
    }

    return(
        <div className={styles.body}>
            <img 
                onClick={goToTopSlide} 
                className={styles.logo} 
                src={`${serverUrl}/Image/CommonImage/LogoWhite.png`}/>
            <JoinInput 
                setCheckPwd={setCheckPwd} 
                checkPwd={checkPwd} 
                diffCheck={diffCheck} 
                setDiffCheck={setDiffCheck}
                dupliCheck={dupliCheck}
                setDupliCheck={setDupliCheck}
                saveInfo={saveInfo}
                setSaveInfo={setSaveInfo}/>
            <button onClick={clickJoin} className={styles.btn}>회원가입</button>
            <div className={styles.loginBox}>
                <span className={styles.loginText}>이미 회원이신가요?</span>
                <span className={styles.loginBtn} onClick={toggleLoginModal}>로그인</span>
            </div>
        </div>
    )
}

export default JoinBox;