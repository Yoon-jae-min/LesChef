//기타
import React from "react";

//CSS
import styles from "../../../CSS/community/show/list/list.module.css";

//컨텍스트
import { useBoardContext } from "../../../Context/board";
import { useConfig } from "../../../Context/configContext";

const CommunityListLine = (props) => {
    const { goToWatch, board } = props;
    const { setSelectedBoard, setCommentList } = useBoardContext();
    const {serverUrl}= useConfig();

    const clickTitle = () => {
        fetch(`${serverUrl}/board/watch?id=${board._id}`,{
            method: "GET"
        }).then(response => response.json()).then(data => {
            const content = data.content[0];
            console.log(data.comments);
            setSelectedBoard({
                id: content._id,
                title: board.title,
                userName: board.nickName,
                writeDate: new Date(board.createdAt).toISOString().split('T')[0],
                watchNum: content.viewCount,
                content: content.content
            })
            setCommentList(data.comments)
        }).catch(err => console.log(err));

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