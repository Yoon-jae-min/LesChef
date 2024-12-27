//기타
import React from "react";

//컨텍스트
import { useConfig } from "../../Context/configContext";

const CommunityFooter = (props) => {
    const { goToWrite } = props;
    const {serverUrl} = useConfig();

    return(
        <div className="communityFooterBox">
            <div className="selectBox">
                <select className="selectBoxContent">
                    <option>제목+내용</option>
                    <option>제목</option>
                    <option>내용</option>
                    <option>닉네임</option>
                </select>
            </div>
            <div className="searchBox">
                <img className="searchButtonImg" src={`${serverUrl}/Image/CommonImage/search.png`}/>
                <input className="searchInput" type="text"/>
                <img className="resetButtonImg" src={`${serverUrl}/Image/CommonImage/cancel.png`}/>
            </div>
            <div className="footerButtonBox">
                <img onClick={goToWrite} className="writeBoxVisible" src={`${serverUrl}/Image/CommunityImage/write.png`}/>
            </div>
        </div>
    )
}

export default CommunityFooter;