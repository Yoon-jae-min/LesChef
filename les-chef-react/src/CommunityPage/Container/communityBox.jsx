import React from "react";
import CommunityHeader from "./communityHeader";
import CommunityBody from "./communityBody";

const CommunityBox = () => {
    return(
        <div className="communityBox">
            <CommunityHeader/>
            <CommunityBody/>
        </div>
    )
}

export default CommunityBox;