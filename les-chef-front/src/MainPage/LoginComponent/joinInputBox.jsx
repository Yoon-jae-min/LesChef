import React from "react";
import LabelInput from "./labelInput";

const JoinInput = () => {
    return(
        <div className="JoinInput">
            <LabelInput boxType = "join" labelText = "이메일(아이디)"/>
            <LabelInput boxType = "join" labelText = "이름"/>
            <LabelInput boxType = "join" labelText = "닉네임"/>
            <LabelInput boxType = "join" labelText = "전화번호"/>
            <LabelInput boxType = "join" labelText = "비밀번호"/>
            <LabelInput boxType = "join" labelText = "비밀번호 확인"/>
        </div>
    )
}

export default JoinInput;