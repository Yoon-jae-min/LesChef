//기타
import React from "react";

//CSS
import styles from "../../../../CSS/community/show/watch/right.module.css";

const CommentUnit = (props) => {
    const { comment } = props;
    const time = new Date(comment.createdAt).toLocaleString("ko-KR",{
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: 'h23'
    }).replace(/\./g, "/").replace(" ", "");

    return(
        <div className={styles.listUnit}>
            <div className={styles.unitHead}>
                <p className={styles.nickName} title="dkdkdkdk">{comment.nickName}</p>
                <p className={styles.writeTime}>{time}</p>
            </div>
            <p className={styles.unitContent}>{comment.content}</p>
        </div>
    )
}

export default CommentUnit;