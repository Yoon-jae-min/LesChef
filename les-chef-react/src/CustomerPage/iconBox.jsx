import React from "react";
import { Link } from "react-router-dom";

const IconBox = () => {
    return(
        <div className="customerIconBox">
            <Link to="/communityMain"><img className="goToCommunityIcon customerLeftIcon" src="/Image/CommonImage/communityIcon.png"/></Link>
            <Link to="/recipeMain" state={{ category: "korean" }}><img className="goToRecipeIcon customerLeftIcon" src="/Image/CommonImage/recipeIcon.png"/></Link>
        </div>
    )  
}

export default IconBox;