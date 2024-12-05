import React from "react";
import CommunityList from "./communityList";

const CommunityBody = (props) => {
    const { goToWatch } = props;

    return(
        <div className="communityBody">
            <CommunityList goToWatch={goToWatch}/>
        </div>
    )
}

export default CommunityBody;