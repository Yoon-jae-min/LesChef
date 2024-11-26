import React from "react";
import "./communityPage.css"
import CommunityBgImg from "../Image/CommunityImage/Background/communityBackground.jpg"
import CommunityBox from "./Container/communityBox";
import IconBox from "./iconBox";

const CommunityPage = () => {
    return(
        <div className="communityBody">
            <img src={CommunityBgImg} className="communityBgImg"/>
            <IconBox/>
            <CommunityBox/>
        </div>
    )
}

export default CommunityPage;