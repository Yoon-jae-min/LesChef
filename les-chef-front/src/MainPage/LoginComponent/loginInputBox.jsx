import React from "react";
import LabelInput from "./labelInput";

const LoginInput = (props) => {
    const { inputId, inputPwd, idValue, pwdValue } = props;

    return (
        <div className="loginInput">
            <LabelInput labelText = "이메일(아이디)" inputValue={inputId} basicValue={idValue}/>
            <LabelInput labelText = "비밀번호" inputValue={inputPwd} basicValue={pwdValue}/>
        </div>
    )
}

export default LoginInput;