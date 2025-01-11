//기타
import React, {useEffect, useState} from "react";

//CSS
import styles from "../../../../CSS/community/show/watch/right.module.css";

//컨텍스트
import { useBoardContext } from "../../../../Context/board";
import { useConfig } from "../../../../Context/configContext";
import { useAuthContext } from "../../../../Context/authContext";

//컴포넌트
import CommentUnit from "./comment";

const Right = () => {
    const [ commentText, setCommentText ] = useState("");
    const {commentList, selectedBoard, setCommentList} = useBoardContext();
    const {serverUrl} = useConfig();
    const {setIsLogin} = useAuthContext();

    const commentWrite = (event) => {
        fetch(`${serverUrl}/customer/auth`,{
            credentials: "include"
        }).then(response => response.json()).then(data => {
            if(data.loggedIn){
                if((event.key === "Enter") && (commentText.trim() !== "")){
                    event.preventDefault();
                    const userData = JSON.parse(sessionStorage.getItem('userData'));
                    fetch(`${serverUrl}/board/commentWrite`,{
                        method: "POST",
                        headers:{
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            boardId: selectedBoard.id,
                            nickName: userData.nickName,
                            userId: userData.id,
                            content: commentText
                        })
                    }).then(response => response.json()).then(data => {
                        setCommentList((prev) => [data, ...prev]);
                    }).catch(err => console.log(err));
                    setCommentText("");
                }
            }else{
                alert('로그인 해주세요');
                setCommentText("");
                setIsLogin(false);
            }
        })
        
    }

    return(
        <div className={styles.box}>
            <textarea value={commentText} className={styles.writeBox} placeholder="댓글을 입력하세요.."
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={commentWrite}></textarea>
            <div className={styles.listBox}>
                {(commentList || []).map((comment, index) => (
                    <CommentUnit 
                        key={index} 
                        comment={comment}/>
                ))}
            </div>
        </div>
    )
}

export default Right;