//기타
import React from "react";

//컴포넌트
import CommunityList from "./list";

const CommunityBody = (props) => {
    const { goToWatch } = props;

    return(
        <div className="communityBody">
            <CommunityList goToWatch={goToWatch}/>
        </div>
    )
}

export default CommunityBody;