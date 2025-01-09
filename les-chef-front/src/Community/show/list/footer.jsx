//기타
import React from "react";

//CSS
import styles from "../../../CSS/community/show/list/footer.module.css";

//컨텍스트
import { useConfig } from "../../../Context/configContext";

const CommunityFooter = (props) => {
    const { goToWrite } = props;
    const {serverUrl} = useConfig();

    const searchReset = () => {
        document.querySelector(".searchInput").value = "";
    }

    return(
        <div className={styles.box}>
            <div className={styles.selectBox}>
                <select className={styles.selectInner}>
                    <option>제목+내용</option>
                    <option>제목</option>
                    <option>내용</option>
                    <option>닉네임</option>
                </select>
            </div>
            <div className={styles.searchBox}>
                <img className={styles.searchBtn} src={`${serverUrl}/Image/CommonImage/search.png`}/>
                <input className={styles.searchInput} type="text"/>
                <img className={styles.resetInput} src={`${serverUrl}/Image/CommonImage/cancel.png`} onClick={searchReset}/>
            </div>
            <div className={styles.btnBox}>
                <img onClick={goToWrite} className={styles.write} src={`${serverUrl}/Image/CommunityImage/write.png`}/>
            </div>
        </div>
    )
}

export default CommunityFooter;