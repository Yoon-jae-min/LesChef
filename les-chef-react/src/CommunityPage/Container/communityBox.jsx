import React, { useState } from "react";
import CommunityHeader from "./communityHeader";
import CommunityBody from "./communityBody";
import CommunityFooter from "./communityFooter";
import CommunityWriteBox from "./communityWriteBox";

const CommunityBox = () => {
    const [ writeBoxVisible, setWriteBoxVisible ] = useState(false);

    const communityBodyTrans = () => {
        if(writeBoxVisible){
            setWriteBoxVisible(false);
        }else{
            setWriteBoxVisible(true);
        }
    }

    return(
        <div className="communityBox">
            <CommunityHeader/>
            { !writeBoxVisible && <CommunityBody/>}
            { !writeBoxVisible && <CommunityFooter communityBodyTrans={communityBodyTrans}/>}
            { writeBoxVisible && <CommunityWriteBox/> }
        </div>
    )
}

export default CommunityBox;