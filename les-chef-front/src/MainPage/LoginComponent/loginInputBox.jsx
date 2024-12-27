//기타
import React from "react";

//컴포넌트
import LabelInput from "./labelInput";

const LoginInput = (props) => {
    const { inputId, inputPwd, idValue, pwdValue } = props;

    return (
        <div className="loginInput">
            <LabelInput 
                boxType = "login" 
                labelText = "이메일(아이디)" 
                inputValue={inputId} 
                basicValue={idValue}/>
            <LabelInput 
                boxType = "login" 
                labelText = "비밀번호" 
                inputValue={inputPwd} 
                basicValue={pwdValue}/>
        </div>
    )
}

export default LoginInput;