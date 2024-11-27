import React from "react";
import { Link } from "react-router-dom";

const IconBox = () => {
    return(
        <div className="communityIconBox">
            <Link to="/"><img className="goToHomeIcon communityLeftIcon" src="/Image/CommonImage/homeIcon.png"/></Link>
            <Link to="/customerMain"><img className="goToCustomerIcon communityLeftIcon" src="/Image/CommonImage/profileIcon.png"/></Link>
            <Link to="/recipeMain" state={{category: "korean"}}><img className="goToRecipeIcon communityLeftIcon" src="/Image/CommonImage/recipeIcon.png"/></Link>
        </div>
    )
}

export default IconBox;