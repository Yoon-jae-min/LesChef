import React from "react";

const WriteBox = (props) => {
    const { goToList } = props;

    return(
        <form className="writeForm">
            <div className="communityWriteBox">
                <div className="titleBox">
                    <p className="writeLabel titleText">제목</p>
                    <input type="text" class="titleUnit"></input>
                </div>
                <div className="nickNameBox">
                    <p className="writeLabel nickNameText">작성자</p>
                    <p class="nickNameUnit">testUser</p>
                </div>
                <div className="writeContent">
                    <textarea className="writeTextarea"></textarea>
                </div>
            </div>
            <div className="writeButtonBox">
                <button className="submitButton" type="submit">등록</button>
                <button onClick={goToList} className="commonButton" type="button">취소</button>
            </div>
        </form>
    )
}

export default WriteBox;