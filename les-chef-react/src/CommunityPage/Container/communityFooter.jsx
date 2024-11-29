import React from "react";

const CommunityFooter = (props) => {
    const { communityBodyTrans } = props;

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
                <img className="searchButtonImg" src="/Image/CommonImage/search.png"/>
                <input className="searchInput" type="text"/>
                <img className="resetButtonImg" src="/Image/CommonImage/cancel.png"/>
            </div>
            <div className="footerButtonBox">
                <img onClick={communityBodyTrans} className="writeBoxVisible" src="/Image/CommunityImage/write.png"/>
            </div>
        </div>
    )
}

export default CommunityFooter;