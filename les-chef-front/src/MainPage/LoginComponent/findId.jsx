//기타
import React from "react";

//컴포넌트
import LabelInput from "./labelInput";

const FindId = () => {
    return(
        <div className="idSwitchContainer">
            <LabelInput 
                labelText="이름"/>
            <LabelInput 
                labelText="휴대폰"/>
            <div className="searchButton">아이디 찾기</div>
        </div>
    )
}

export default FindId;