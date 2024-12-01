import React, { useState } from "react";
import { useWatchContext } from "../CommonElement/watchContext";
import CommentUnit from "./watchCommentUnit";

const CommunityWatchBox = (props) => {
    const { goToList } = props;
    const { watchValue } = useWatchContext(); 
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
        <form className="watchForm">
            <div className="communityWatchBox">
                <div className="watchLeftBox">
                    <div className="watchTitleBox">
                        <p className="watchTitleLabel titleText">제목</p>
                        <p class="watchTitleUnit">{watchValue.title}</p>
                    </div>
                    <div className="userDateBox">
                        <div className="nickNameBox watchNickName">
                            <p className="watchLabel nickNameText">작성자</p>
                            <p class="watchNameValue">{watchValue.userName}</p>
                        </div>
                        <div className="watchWriteDate">
                            <p className="watchLabel writeDateText">작성일</p>
                            <p class="writeDateUnit">{watchValue.writeDate}</p>
                        </div>
                    </div>
                    <div className="watchContent">
                        <div className="watchContentInner">
                            {watchValue.content}
                        </div>
                    </div>
                </div>
                <div className="watchRightBox">
                    <textarea value={commentText} className="commentWriteBox" placeholder="댓글을 입력하세요.."
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={enterKeyDown}></textarea>
                    <div className="commentListBox">
                        {comments.map((comment, index) => (
                            <CommentUnit key={index} content={comment.content} dateTime={comment.dateTime}/>
                        ))}
                    </div>
                </div>
            </div>

            <div className="watchButtonBox">
                <button onClick={goToList} className="goToList" type="button">리스트로</button>
                <button className="goToReWrite" type="button">수정</button>
            </div>
        </form>
    )
}

export default CommunityWatchBox;