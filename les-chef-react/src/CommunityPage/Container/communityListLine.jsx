import React from "react";

const CommunityListLine = () => {
    return(
        <div className="communityListLine">
            <div className="listTitleUnit listLineUnit">제목</div>
            <div className="listNameUnit listLineUnit lineCenter">닉네임</div>
            <div className="listDateUnit listLineUnit lineCenter">작성일</div>
            <div className="listWatchUnit listLineUnit lineCenter">조회수</div>
        </div>
    )
}

export default CommunityListLine;