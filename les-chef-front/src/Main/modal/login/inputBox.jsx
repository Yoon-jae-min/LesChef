//기타
import React from "react";

//CSS
import styles from "../../../CSS/main/modal/login.module.css";

//컴포넌트
import LabelInput from "../../common/labelInput";

const LoginInput = (props) => {
    const { inputId, inputPwd, idValue, pwdValue, clickLogin } = props;

    return (
        <div className={styles.inputBox}>
            <LabelInput 
                boxType = "login" 
                labelText = "이메일(아이디)" 
                inputValue={inputId} 
                basicValue={idValue}/>
            <LabelInput 
                boxType = "login" 
                labelText = "비밀번호" 
                inputValue={inputPwd} 
                basicValue={pwdValue}
                clickLogin={clickLogin}/>
        </div>
    )
}

export default LoginInput;