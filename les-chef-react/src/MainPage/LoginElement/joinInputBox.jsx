import React from "react";
import LabelInput from "./labelInput";

const JoinInput = () => {
    return(
        <div className="JoinInput">
            <LabelInput labelText = "이메일(아이디)"/>
            <LabelInput labelText = "이름"/>
            <LabelInput labelText = "닉네임"/>
            <LabelInput labelText = "전화번호"/>
            <LabelInput labelText = "비밀번호"/>
            <LabelInput labelText = "비밀번호 확인"/>
        </div>
    )
}

export default JoinInput;