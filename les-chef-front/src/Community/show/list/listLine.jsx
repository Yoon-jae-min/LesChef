//기타
import React from "react";

//CSS
import styles from "../../../CSS/community/show/list/list.module.css";

//컨텍스트
import { useWatchContext } from "../../../Context/watchContext";
import { useBoardContext } from "../../../Context/board";

const CommunityListLine = (props) => {
    const { goToWatch, board } = props;
    const { setWatchValue } = useWatchContext();

    const clickTitle = () => {
        setWatchValue({
            title: "선택한 제목",
            userName: "선택한 사용자 이름",
            writeDate: "2024-11-30",
            watchNum: "123",
            content: "선택한 게시글의 내용입니다.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        });

        goToWatch();
    }

    return(
        <div className={styles.line}>
            <div onClick={clickTitle} className={`${styles.title} ${styles.lineTitle} ${styles.lineUnit}`}>{board.title}</div>
            <div className={`${styles.name} ${styles.lineUnit} ${styles.unitCenter}`}>{board.nickName}</div>
            <div className={`${styles.date} ${styles.lineUnit} ${styles.unitCenter}`}>{new Date(board.createdAt).toISOString().split('T')[0]}</div>
            <div className={`${styles.watch} ${styles.lineUnit} ${styles.unitCenter}`}>{board.viewCount}</div>
        </div>
    )
}

export default CommunityListLine;