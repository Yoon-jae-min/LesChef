import React from "react";

const WriteBox = () => {
    return(
        <div className="communityWriteBox">
            <div className="titleBox">
                <p className="writeLabel titleText">제목</p>
                <input type="text" class="titleUnit"></input>
            </div>
            <div className="nickNameBox">
                <p className="writeLabel nickNameText">작성자</p>
                <p class="nickNameUnit">사용자</p>
            </div>
            <div className="writeContent">
                <textarea></textarea>
            </div>
        </div>
    )
}

export default WriteBox;