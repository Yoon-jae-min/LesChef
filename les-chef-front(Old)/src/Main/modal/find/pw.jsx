//기타
import React from "react";

//CSS
import styles from "../../../CSS/main/modal/find.module.css";

//컴포넌트
import LabelInput from "../../common/labelInput";

const FindPw = (props) => {
    const {switchFindToLogin} = props;

    const clickToLogin = () => {
        switchFindToLogin();
    }

    return(
        <React.Fragment>
            <div className={styles.inputBox}>
                <LabelInput 
                    labelText="이름"/>
                <LabelInput 
                    labelText="휴대폰"/>
                <LabelInput 
                    labelText="이메일(아이디)"/>
            </div>
            <div className={`${styles.searchBtn} ${styles.pwSearchBtn}`}>비밀번호 재설정</div>
            <p className={styles.loginText}>로그인 하시겠습니까?<span onClick={clickToLogin} className={styles.loginBtn}>로그인</span></p>
        </React.Fragment>
    )
}

export default FindPw;