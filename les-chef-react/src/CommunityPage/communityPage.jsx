import React from "react";
import "./communityPage.css"
import CommunityBox from "./Container/communityBox";
import IconBox from "./iconBox";

const CommunityPage = () => {
    return(
        <div className="communityMain">
            <img src="/Image/CommunityImage/Background/communityBackground.jpg" className="communityBgImg"/>
            <IconBox/>
            <CommunityBox/>
        </div>
    )
}

export default CommunityPage;