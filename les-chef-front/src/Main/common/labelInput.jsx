//기타
import React from "react";

//CSS
import styles from "../../CSS/main/common/input.module.css";
import join from "../../CSS/main/section/join.module.css";

//컨텍스트
import { useConfig } from "../../Context/config";

const LabelInput = (props) => {
    const { labelText, 
            boxType, 
            inputValue, 
            basicValue, 
            setCheckPwd, 
            diffCheck, 
            setDiffCheck, 
            dupliCheck, 
            setDupliCheck,
            saveInfo,
            setSaveInfo,
            clickLogin } = props;
    const {serverUrl} = useConfig();

    const changeValue = (value) => {
        if(boxType === "join"){
            const fieldMapping = {
                // "이메일(아이디)": "id",
                "비밀번호": "pwd",
                "이름": "name",
                "닉네임": "nickName",
                "전화번호": "tel",
            };
        
            const field = fieldMapping[labelText];
            if (field) {
                let formattedValue = value;
    
                if (labelText === "전화번호") {
                    let numericValue = value.replace(/[^0-9]/g, "");

                    if (numericValue.length > 11) {
                        numericValue = numericValue.slice(0, 11);
                    }

                    formattedValue = numericValue.replace((numericValue.length <= 10) ? 
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
                }
    
                setSaveInfo((prevInfo) => ({ ...prevInfo, [field]: formattedValue }));
            }
        }else if(boxType === "login"){
            inputValue(value);
        }
        
        if(labelText === "비밀번호 확인"){
            setCheckPwd(value);
            if(!value){
                setDiffCheck(false);
            }else{
                setDiffCheck(saveInfo.pwd !== value);
            }
        }
    };

    const chgIdValue = () => {
        const first = document.querySelector('.emailInputOne').value;
        const second = document.querySelector('.emailInputTwo').value;
        
        setDupliCheck(false);
        setSaveInfo((prevInfo) => ({...prevInfo, id: first + "@" + second}));
    }

    const clickDupliCheck = () => {
        const first = document.querySelector('.emailInputOne').value;
        const second = document.querySelector('.emailInputTwo').value;
        if(!first || !second){
            alert('아이디를 입력해주세요');
            return;
        }
        const idValue =  first + "@" + second;
        if(idValue){
            fetch(`${serverUrl}/customer/check?id=${idValue}`)
            .then(response => response.text())
            .then((data) => {
                console.log(data);
                if(data === "중복"){
                    alert("중복된 아이디 입니다.");
                }else{
                    setDupliCheck(true);
                }
            }).catch(err => console.log(err));
        }else{
            alert("아이디를 입력해주세요");
        }
    }

    const enterLogin = (e) => {
        if(e.key === 'Enter' && (boxType === "login") && (labelText === "비밀번호")){
            clickLogin();
        }
    }

    return(
        <React.Fragment>
            {(labelText !== "이메일(아이디)") ? 
                <React.Fragment>
                    <label className={styles.label}>
                        {labelText}
                        {(diffCheck && (labelText === "비밀번호 확인")) && <p className={join.diffCheck}> ※ 비밀번호가 다릅니다</p>}
                        {/* { ( !dupliCheck && (labelText === "이메일(아이디)") && (boxType === "join")) && 
                            <button onClick={clickDupliCheck} type="button" className={join.dupliCheckBtn}>중복확인</button>
                        }
                        { ( dupliCheck && (labelText === "이메일(아이디)")) && 
                            <p className={join.idCheckedText}>확인 되었습니다</p>
                        } */}
                    </label>
                    <input 
                        type={labelText.includes("비밀번호") ? "password" : "text"} 
                        value={basicValue} onChange={(e) => {changeValue(e.target.value)}} 
                        onKeyDown={(e) => enterLogin(e)}
                        className={`${styles.input} ${labelText === "이메일(아이디)" ? "emailInput" : ""}`}></input>
                </React.Fragment> :
                <React.Fragment>
                    <label className={styles.label}>
                        {labelText}
                        {(!dupliCheck && (boxType === "join")) && <button onClick={clickDupliCheck} type="button" className={join.dupliCheckBtn}>중복확인</button>}
                        {dupliCheck && <p className={join.idCheckedText}>확인 되었습니다</p>}
                    </label>
                    {(boxType === "join") ? 
                        <React.Fragment>
                            <input 
                                type="text" 
                                value={basicValue.substring(0, basicValue.indexOf("@"))} onChange={chgIdValue}
                                onKeyDown={(e) => enterLogin(e)}
                                className={`${styles.inputId} emailInputOne`}></input>
                            <p className={styles.idBetween}>@</p>
                            <input 
                                type="text" 
                                value={basicValue.substring(basicValue.indexOf("@") + 1)} onChange={chgIdValue} 
                                onKeyDown={(e) => enterLogin(e)}
                                className={`${styles.inputId} emailInputTwo`}></input>
                        </React.Fragment> :
                        <React.Fragment>
                            <input 
                                type="text"
                                value={basicValue} onChange={(e) => {changeValue(e.target.value)}} 
                                onKeyDown={(e) => enterLogin(e)}
                                className={`${styles.input} emailInput`}></input>
                        </React.Fragment>
                    }
                    
                </React.Fragment>
            }
        </React.Fragment>
    )
}

export default LabelInput;