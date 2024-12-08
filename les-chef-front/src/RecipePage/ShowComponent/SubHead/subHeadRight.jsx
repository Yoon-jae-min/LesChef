import React from "react";

const ShowGpBoxRight = (props) => {
    const {infoGoto} = props;

    return(
        <div className="showGpBoxRight">
            {infoGoto && <div className="recommendBtn"><img src="/Image/RecipeImage/InfoImg/noLike.png"/></div>}
            {!infoGoto && <>
            <div className="orderButton">최신순</div>
            <div className="orderButton">추천순</div></>
            }
        </div>
    )
}

export default ShowGpBoxRight;