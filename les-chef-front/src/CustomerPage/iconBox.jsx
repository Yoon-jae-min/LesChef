//기타
import React from "react";
import { Link } from "react-router-dom";

//컨텍스트
import { useConfig } from "../Context/configContext";

const IconBox = () => {
    const {serverUrl} = useConfig();

    return(
        <div className="customerIconBox">
            <Link to="/communityMain">
                <img className="goToCommunityIcon customerLeftIcon" src={`${serverUrl}/Image/CommonImage/communityIcon.png`}/></Link>
            <Link to="/recipeMain" state={{ category: "korean" }}>
                <img className="goToRecipeIcon customerLeftIcon" src={`${serverUrl}/Image/CommonImage/recipeIcon.png`}/></Link>
        </div>
    )  
}

export default IconBox;