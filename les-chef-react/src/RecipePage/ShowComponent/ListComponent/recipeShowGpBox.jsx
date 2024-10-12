import React from "react";
import ShowGpBoxLeft from "./showGpBoxLeft";
import ShowGpBoxRight from "./showGpBoxRight";

const RecipeShowGpBox = (props) => {
    const {category, infoGoto} = props;

    return(
        <div className="showGpBox">
            { (category !== "share") && <ShowGpBoxLeft category={category} infoGoto={infoGoto}/>}
            <ShowGpBoxRight infoGoto={infoGoto}/>
        </div>
    )
}

export default RecipeShowGpBox;