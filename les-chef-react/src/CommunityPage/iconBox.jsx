import React from "react";
import HomeImg from "../Image/CommonImage/homeIcon.png"
import ProfileImg from "../Image/CommonImage/profileIcon.png"
import RecipeImg from "../Image/CommonImage/recipeIcon.png"
import { Link } from "react-router-dom";

const IconBox = () => {
    return(
        <div className="communityIconBox">
            <Link to="/"><img className="goToHomeIcon communityLeftIcon" src={HomeImg}/></Link>
            <Link to="/customerMain"><img className="goToCustomerIcon communityLeftIcon" src={ProfileImg}/></Link>
            <Link to="/recipeMain" state={{category: "korean"}}><img className="goToRecipeIcon communityLeftIcon" src={RecipeImg}/></Link>
        </div>
    )
}

export default IconBox;