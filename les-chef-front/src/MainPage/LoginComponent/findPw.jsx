//기타
import React from "react";

//컴포넌트
import LabelInput from "./labelInput";

const FindPw = (props) => {
    const {switchFindToLogin} = props;

    const clickToLogin = () => {
        switchFindToLogin();
    }

    return(
        <div className="pwSwitchContainer">
            <LabelInput 
                labelText="이름"/>
            <LabelInput 
                labelText="휴대폰"/>
            <LabelInput 
                labelText="이메일(아이디)"/>
            <div className="searchButton pwSearch">비밀번호 재설정</div>
            <p className="findToLoginText">로그인 하시겠습니까?<span onClick={clickToLogin} className="findToLoginBtn">로그인</span></p>
        </div>
    )
}

export default FindPw;