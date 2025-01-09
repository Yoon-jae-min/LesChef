//기타
import React from "react";

//CSS
import styles from "../../../../CSS/community/show/watch/right.module.css";

const CommentUnit = (props) => {
    const { content, dateTime } = props;

    return(
        <div class={styles.listUnit}>
            <div className={styles.unitHead}>
                <p className={styles.nickName} title="dkdkdkdk">dkdkdkdk</p>
                <p className={styles.writeTime}>{dateTime}</p>
            </div>
            <p className={styles.unitContent}>{content}</p>
        </div>
    )
}

export default CommentUnit;