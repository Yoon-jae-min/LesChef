//기타
import React, { useEffect, useState } from "react";

//CSS
import styles from "../../../CSS/community/show/list/list.module.css";

//컨텍스트
import { useConfig } from "../../../Context/configContext";
import { useBoardContext } from "../../../Context/board";

//컴포넌트
import CommunityListLine from "./listLine";

const CommunityList = (props) => {
    const { goToWatch } = props;
    const { serverUrl } = useConfig();
    const [ pageNum, setPageNum ] = useState(1);
    const { isFetching, setIsFetching} = useState(false);
    const { hasMoreData, setHasMoreData} = useState(true);
    const { boardList, setBoardList } = useBoardContext();

    useEffect(() => {
        getWrite();
        console.log(boardList);
    }, []);

    const getWrite = () => {
        fetch(`${serverUrl}/board/write?page=${pageNum}`,{
            method: "GET"
        }).then(response => response.json()).then(data => {
            if(data.length === 0){
                setHasMoreData(false);
            }else{
                console.log(data);
                setBoardList((prev) => [...prev, ...data]);
                setPageNum(prev => prev + 1);
            }
        }).catch(err => console.log(err));
    }

    const scrollEnd = (target) => {
        if(isFetching || !hasMoreData) return;

        const isBottom = Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 1;

        setIsFetching(true);

        if(isBottom && hasMoreData){
            getWrite();
        }
    }

    return(
        <React.Fragment>
            <div className={styles.head}>
                <div className={`${styles.title} ${styles.headUnit} ${styles.unitCenter}`}>제목</div>
                <div className={`${styles.name} ${styles.headUnit} ${styles.unitCenter}`}>닉네임</div>
                <div className={`${styles.date} ${styles.headUnit} ${styles.unitCenter}`}>작성일</div>
                <div className={`${styles.watch} ${styles.headUnit} ${styles.unitCenter}`}>조회수</div>
            </div>
            <div className={styles.body} onScroll={(e) => scrollEnd(e.target)}>
                {(boardList || []).length === 0 ? <div className={styles.empty}>게시글이 존재하지 않습니다</div> : 
                    (boardList || []).map((board, index) => 
                        <CommunityListLine key={index} board={board} goToWatch={goToWatch}/>
                    )}
            </div>
        </React.Fragment>
    )
}

export default CommunityList;