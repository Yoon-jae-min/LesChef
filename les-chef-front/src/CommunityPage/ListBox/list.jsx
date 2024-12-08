import React from "react";
import CommunityListLine from "./listLine";

const CommunityList = (props) => {
    const { goToWatch } = props;

    return(
        <div className="communityListBox">
            <div className="communityListHead">
                <div className="listTitleUnit listHeadUnit">제목</div>
                <div className="listNameUnit listHeadUnit">닉네임</div>
                <div className="listDateUnit listHeadUnit">작성일</div>
                <div className="listWatchUnit listHeadUnit">조회수</div>
            </div>
            <div className="communityListBody">
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
                <CommunityListLine goToWatch={goToWatch}/>
            </div>
        </div>
    )
}

export default CommunityList;