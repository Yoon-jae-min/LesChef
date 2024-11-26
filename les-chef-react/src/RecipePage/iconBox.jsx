import React from "react";
import { Link } from "react-router-dom";
import ProfileImage from '../Image/CommonImage/profileIcon.png'
import CommunityImage from "../Image/CommonImage/communityIcon.png"

const IconBox = () => {
    return(
        <div className="recipeIconBox">
            <Link to="/customerMain"><img src={ProfileImage} className="goToCustomerIcon recipeLeftIcon"/></Link>
            <Link to="/communityMain"><img src={CommunityImage} className="goToCustomerIcon recipeLeftIcon"/></Link>
        </div>
    )
}

export default IconBox;