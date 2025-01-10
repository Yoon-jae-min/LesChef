//기타
import React from "react";

//CSS
import styles from "../../../../CSS/community/show/watch/left.module.css";

//컨텍스트
import { useWatchContext } from "../../../../Context/watchContext";

const Left =  () => {
    const { watchValue } = useWatchContext(); 

    return(
        <div className={styles.box}>
            <div className={styles.titleBox}>
                <p className={`${styles.titleLabel} titleText`}>제목</p>
                <p className={styles.titleContent}>{watchValue.title}</p>
            </div>
            <div className={styles.userDateBox}>
                <div className={styles.nickNameBox}>
                    <p className={styles.userDateLabel}>작성자</p>
                    <p className={styles.nameValue}>{watchValue.userName}</p>
                </div>
                <div className={styles.writeDateBox}>
                    <p className={styles.userDateLabel}>작성일</p>
                    <p className={styles.dateValue}>{watchValue.writeDate}</p>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.contentInner}>
                    {watchValue.content}
                </div>
            </div>
        </div>
    )
}

export default Left;