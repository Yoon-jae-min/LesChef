import React from "react";

const CommunityHeader = () => {
    const pageReLoad = () => {
        window.location.reload();
    }

    return(
        <div className="communityHead">
            <img className="communityHeadImg" src="/Image/CommunityImage/Background/communityHeader.jpg"/>
            <p onClick={pageReLoad} className="communityHeadText">Community</p>
        </div>
    )
}

export default CommunityHeader;