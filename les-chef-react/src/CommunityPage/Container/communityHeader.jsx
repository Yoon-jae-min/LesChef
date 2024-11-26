import React from "react";
import headImgUrl from "../../Image/CommunityImage/Background/communityHeader.jpg"

const CommunityHeader = () => {
    return(
        <div className="communityHead">
            <img className="communityHeadImg" src={headImgUrl}/>
            <p className="communityHeadText">Community</p>
        </div>
    )
}

export default CommunityHeader;