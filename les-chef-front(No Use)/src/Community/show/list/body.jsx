//기타
import React from "react";

//CSS
import styles from "../../../CSS/community/show/list/list.module.css";

//컴포넌트
import CommunityList from "./list";

const CommunityBody = (props) => {
    const { goToWatch } = props;

    return(
        <div className={styles.box}>
            <CommunityList goToWatch={goToWatch}/>
        </div>
    )
}

export default CommunityBody;