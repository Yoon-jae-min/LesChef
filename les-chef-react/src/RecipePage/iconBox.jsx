import React from "react";
import { Link } from "react-router-dom";

const IconBox = () => {
    return(
        <div className="recipeIconBox">
            <Link to="/customerMain"><img src="/Image/CommonImage/profileIcon.png" className="goToCustomerIcon recipeLeftIcon"/></Link>
            <Link to="/communityMain"><img src="/Image/CommonImage/communityIcon.png" className="goToCustomerIcon recipeLeftIcon"/></Link>
        </div>
    )
}

export default IconBox;