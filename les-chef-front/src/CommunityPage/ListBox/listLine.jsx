//기타
import React from "react";

//컨텍스트
import { useWatchContext } from "../../Context/watchContext";

const CommunityListLine = (props) => {
    const { goToWatch } = props;
    const { setWatchValue } = useWatchContext();

    const clickTitle = () => {
        setWatchValue({
            title: "선택한 제목",
            userName: "선택한 사용자 이름",
            writeDate: "2024-11-30",
            watchNum: "123",
            content: "선택한 게시글의 내용입니다.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        });

        goToWatch();
    }

    return(
        <div className="communityListLine">
            <div onClick={clickTitle} className="listTitleUnit listLineUnit">제목</div>
            <div className="listNameUnit listLineUnit lineCenter">닉네임</div>
            <div className="listDateUnit listLineUnit lineCenter">작성일</div>
            <div className="listWatchUnit listLineUnit lineCenter">조회수</div>
        </div>
    )
}

export default CommunityListLine;