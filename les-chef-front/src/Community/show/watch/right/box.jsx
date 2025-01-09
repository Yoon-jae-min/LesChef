//기타
import React, {useState} from "react";

//CSS
import styles from "../../../../CSS/community/show/watch/right.module.css";

//컴포넌트
import CommentUnit from "./comment";

const Right = () => {
    const [ comments, setComments ] = useState([]);
    const [ commentText, setCommentText ] = useState("");

    const getFormattedDateTime = () => {
        const now = new Date();
        const year = String(now.getFullYear()).slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    };

    const enterKeyDown= (event) => {
        if(event.key === "Enter"){
            event.preventDefault();
            if (commentText.trim() !== "") {
                setComments((prevComments) => [
                    ...prevComments,
                    { 
                        content: commentText,
                        dateTime: getFormattedDateTime()
                    }
                ]);   
                setCommentText("");
            }
        }
    }

    return(
        <div className={styles.box}>
            <textarea value={commentText} className={styles.writeBox} placeholder="댓글을 입력하세요.."
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={enterKeyDown}></textarea>
            <div className={styles.listBox}>
                {comments.map((comment, index) => (
                    <CommentUnit 
                        key={index} 
                        content={comment.content} 
                        dateTime={comment.dateTime}/>
                ))}
            </div>
        </div>
    )
}

export default Right;