//기타
import React from "react";

const CommentUnit = (props) => {
    const { content, dateTime } = props;

    return(
        <div class="watchCommentUnit">
            <div className="commentUnitHead">
                <p className="commentNickName" title="dkdkdkdk">dkdkdkdk</p>
                <p className="commentWriteTime">{dateTime}</p>
            </div>
            <p className="commentUnitContent">{content}</p>
        </div>
    )
}

export default CommentUnit;