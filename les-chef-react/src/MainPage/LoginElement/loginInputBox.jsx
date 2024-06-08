import React from "react";
import LabelInput from "./labelInput";

const LoginInput = () => {
    return (
        <div className="loginInput">
            <LabelInput labelText = "이메일(아이디)"/>
            <LabelInput labelText = "비밀번호"/>
        </div>
    )
}

export default LoginInput;