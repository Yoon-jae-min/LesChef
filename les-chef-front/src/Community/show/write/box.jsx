//기타
import React from "react";

//CSS
import styles from "../../../CSS/community/show/write/write.module.css";

const WriteBox = (props) => {
    const { goToList } = props;

    return(
        <React.Fragment>
            <div className={styles.box}>
                <div className={styles.title}>
                    <p className={`${styles.label} titleText`}>제목</p>
                    <input type="text" className={styles.titleUnit}></input>
                </div>
                <div className={styles.nickName}>
                    <p className={`${styles.label} nickNameText`}>작성자</p>
                    <p className={styles.nickNameUnit}>testUser</p>
                </div>
                <div className={styles.content}>
                    <textarea className={styles.textArea}></textarea>
                </div>
            </div>
            <div className={styles.btnBox}>
                <button className={styles.submitBtn} type="button">등록</button>
                <button onClick={goToList} className={styles.commonBtn} type="button">취소</button>
            </div>
        </React.Fragment>
    )
}

export default WriteBox;