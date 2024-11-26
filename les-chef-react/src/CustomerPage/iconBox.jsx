import React from "react";
import { Link } from "react-router-dom";
import CommunityImg from "../Image/CommonImage/communityIcon.png";
import RecipeImg from "../Image/CommonImage/recipeIcon.png";

const IconBox = () => {
    return(
        <div className="customerIconBox">
            <Link to="/communityMain"><img className="goToCommunityIcon customerLeftIcon" src={CommunityImg}/></Link>
            <Link to="/recipeMain" state={{ category: "korean" }}><img className="goToRecipeIcon customerLeftIcon" src={RecipeImg}/></Link>
        </div>
    )  
}

export default IconBox;