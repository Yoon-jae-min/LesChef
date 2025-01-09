//기타
import React from "react";

//CSS
import styles from "../../../CSS/community/show/list/list.module.css";

//컴포넌트
import CommunityListLine from "./listLine";

const CommunityList = (props) => {
    const { goToWatch } = props;

    return(
        <React.Fragment>
        {/* <div className="communityListBox"> */}
            <div className={styles.head}>
                <div className={`${styles.title} ${styles.headUnit} ${styles.unitCenter}`}>제목</div>
                <div className={`${styles.name} ${styles.headUnit} ${styles.unitCenter}`}>닉네임</div>
                <div className={`${styles.date} ${styles.headUnit} ${styles.unitCenter}`}>작성일</div>
                <div className={`${styles.watch} ${styles.headUnit} ${styles.unitCenter}`}>조회수</div>
            </div>
            <div className={styles.body}>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
            </div>
        {/* </div> */}
        </React.Fragment>
    )
}

export default CommunityList;