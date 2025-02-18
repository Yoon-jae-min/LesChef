//기타
import React from "react";

//CSS
import styles from "../../../../CSS/customer/show/info/contentBox/notice.module.css";

const Notice = () => {
    return(
        <React.Fragment>
            <div className={styles.box}>
                <div className={styles.body}>
                    <p>sns 로그인 시 초기 비밀번호는 다음과 같습니다.</p>
                    <p>• kakaoLogin =&gt; kakao</p>
                    <p>• googleLogin =&gt; google</p>
                    <p>• naverLogin =&gt; naver</p>
                    <p>가급적 빠른 시일 내 변경해주세요.</p>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Notice;