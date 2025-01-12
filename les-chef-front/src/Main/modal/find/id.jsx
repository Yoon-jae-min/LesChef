//기타
import React from "react";

//CSS 
import styles from "../../../CSS/main/modal/find.module.css";

//컴포넌트
import LabelInput from "../../common/labelInput";

const FindId = (props) => {
    const {toggleFindBox} = props;

    const clickToLogin = () => {
        toggleFindBox();
    }

    return(
        <div className={styles.inputBox}>
            <LabelInput 
                labelText="이름"/>
            <LabelInput 
                labelText="휴대폰"/>
            <div className={styles.searchBtn}>아이디 찾기</div>
            <p className={styles.loginText}>로그인 하시겠습니까?<span onClick={clickToLogin} className={styles.loginBtn}>로그인</span></p>
        </div>
    )
}

export default FindId;