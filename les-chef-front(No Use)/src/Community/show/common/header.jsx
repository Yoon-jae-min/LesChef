//기타
import React from "react";

//CSS
import styles from "../../../CSS/community/show/common/show.module.css";

const CommunityHeader = () => {
    const pageReLoad = () => {
        window.location.reload();
    }

    return(
        <div className={styles.head}>
            <img className={styles.headImg} src="/Image/CommunityImage/Background/communityHeader.jpg"/>
            <p onClick={pageReLoad} className={styles.headText}>Community</p>
        </div>
    )
}

export default CommunityHeader;