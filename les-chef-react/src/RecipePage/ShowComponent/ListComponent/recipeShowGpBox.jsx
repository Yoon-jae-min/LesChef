import React from "react";
import ShowGpBoxLeft from "./showGpBoxLeft";
import ShowGpBoxRight from "./showGpBoxRight";

const RecipeShowGpBox = (props) => {
    const {category} = props;

    return(
        <div className="showGpBox">
            { (category !== "share") && <ShowGpBoxLeft category={category}/>}
            <ShowGpBoxRight/>
        </div>
    )
}

export default RecipeShowGpBox;