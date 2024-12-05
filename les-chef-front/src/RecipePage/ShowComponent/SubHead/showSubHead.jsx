import React from "react";
import ShowSubHeadLeft from "./showSubHeadLeft";
import ShowSubHeadRight from "./showSubHeadRight";

const RecipeShowGpBox = (props) => {
    const {category, infoGoto} = props;

    return(
        <div className="showGpBox">
            <ShowSubHeadLeft category={category} infoGoto={infoGoto}/>
            <ShowSubHeadRight infoGoto={infoGoto}/>
        </div>
    )
}

export default RecipeShowGpBox;