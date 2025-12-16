//기타
import React from "react";

//CSS
import styles from "../../../../CSS/community/show/watch/watch.module.css";

//컨텍스트
import { useConfig } from "../../../../Context/config";
import { useBoardContext } from "../../../../Context/board";
import { useUserContext } from "../../../../Context/user";

//컴포넌트
import Left from "../left/box";
import Right from "../right/box";

const CommunityWatchBox = (props) => {
    const { goToList } = props;
    const {serverUrl} = useConfig();
    const {selectedBoard} = useBoardContext();
    const {authCheck} = useUserContext();

    const deleteBoard = async() => {
        if(await authCheck()){
            if(selectedBoard.userId === JSON.parse(sessionStorage.getItem('userData')).id){
                fetch(`${serverUrl}/board/delete?id=${selectedBoard.id}`,{
                    method: "GET"
                }).then(response => {
                    goToList();
                }).catch(err => console.log(err));
            }else{
                alert('작성자만 삭제할 수 있습니다');
            }
        }else{
            alert('로그인이 필요합니다');
        }
    }

    return(
        <React.Fragment>
            <div className={styles.box}>
                <Left/>
                <Right/>
            </div>
            <div className={styles.btnBox}>
                <button onClick={goToList} className={styles.list} type="button">리스트로</button>
                <button className={styles.reWrite} type="button">수정</button>
                <button onClick={deleteBoard} className={styles.delete} type="button">삭제</button>
            </div>
        </React.Fragment>
    )
}

export default CommunityWatchBox;