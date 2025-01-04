//기타
import React from "react";

//컴포넌트
import LabelInput from "./labelInput";

const FindId = (props) => {
    const {switchFindToLogin} = props;

    const clickToLogin = () => {
        switchFindToLogin();
    }

    return(
        <div className="idSwitchContainer">
            <LabelInput 
                labelText="이름"/>
            <LabelInput 
                labelText="휴대폰"/>
            <div className="searchButton">아이디 찾기</div>
            <p className="findToLoginText">로그인 하시겠습니까?<span onClick={clickToLogin} className="findToLoginBtn">로그인</span></p>
        </div>
    )
}

export default FindId;