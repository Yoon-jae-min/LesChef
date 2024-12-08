import React from "react";
import ShowSubHeadLeft from "./subHeadLeft";
import ShowSubHeadRight from "./subHeadRight";

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