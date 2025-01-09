//기타
import React from "react";

//CSS
import styles from "../../../../CSS/community/show/watch/watch.module.css";

//컴포넌트
import Left from "../left/box";
import Right from "../right/box";

const CommunityWatchBox = (props) => {
    const { goToList } = props;

    return(
        <React.Fragment>
            <div className={styles.box}>
                <Left/>
                <Right/>
            </div>
            <div className={styles.btnBox}>
                <button onClick={goToList} className={styles.list} type="button">리스트로</button>
                <button className={styles.reWrite} type="button">수정</button>
            </div>
        </React.Fragment>
    )
}

export default CommunityWatchBox;