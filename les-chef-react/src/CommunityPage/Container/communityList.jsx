import React from "react";
import CommunityListLine from "./communityListLine";

const CommunityList = () => {
    return(
        <div className="communityListBox">
            <div className="communityListHead">
                <div className="listTitleUnit listHeadUnit">제목</div>
                <div className="listNameUnit listHeadUnit">닉네임</div>
                <div className="listDateUnit listHeadUnit">작성일</div>
                <div className="listWatchUnit listHeadUnit">조회수</div>
            </div>
            <div className="communityListBody">
                <CommunityListLine/>
                <CommunityListLine/>
                <CommunityListLine/>
                <CommunityListLine/>
                <CommunityListLine/>
                <CommunityListLine/>
                <CommunityListLine/>
                <CommunityListLine/>
                <CommunityListLine/>
                <CommunityListLine/>
                <CommunityListLine/>
            </div>
        </div>
    )
}

export default CommunityList;