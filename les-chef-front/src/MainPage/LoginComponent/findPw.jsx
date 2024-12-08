import React from "react";
import LabelInput from "./labelInput";

const FindPw = () => {
    return(
        <div className="pwSwitchContainer">
            <LabelInput labelText="이름"/>
            <LabelInput labelText="휴대폰"/>
            <LabelInput labelText="이메일(아이디)"/>
            <div className="searchButton pwSearch">비밀번호 찾기</div>
        </div>
    )
}

export default FindPw;