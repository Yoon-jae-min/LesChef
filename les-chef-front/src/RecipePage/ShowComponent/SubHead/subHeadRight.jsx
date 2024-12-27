//기타
import React from "react";

//컨텍스트
import { useConfig } from "../../../Context/configContext";

const ShowGpBoxRight = (props) => {
    const {infoGoto} = props;
    const {serverUrl} = useConfig();

    return(
        <div className="showGpBoxRight">
            {infoGoto && 
                <div className="recommendBtn">
                    <img src={`${serverUrl}/Image/RecipeImage/InfoImg/noLike.png`}/></div>}
            {!infoGoto && 
                <React.Fragment>
                    <div className="orderButton">최신순</div>
                    <div className="orderButton">추천순</div></React.Fragment>
            }
        </div>
    )
}

export default ShowGpBoxRight;