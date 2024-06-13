import React from "react";
import BlackLogo from "../Image/RecipeImage/blackLogo.png";
import CommunityImg from "../Image/RecipeImage/communityImg.png";
import MyPageImg from "../Image/RecipeImage/myPageImg.png";
import LoginBlackImg from "../Image/RecipeImage/loginBlack.png";
import { Link } from "react-router-dom";

const ListMainHeader = () => {
    return(
        <div className="recipeListHeader">
            <Link to="/" className="recipeLogo"><img src={BlackLogo}/></Link>
            <div className="headerIcon">
                <img src={CommunityImg} className="communityImg"/>
                <div className="headerRight">
                    <img src={MyPageImg} className="myPageImg"/>
                    <img src={LoginBlackImg} className="loginImg"/>
                </div>
            </div>
            
        </div>
    )
}

export default ListMainHeader;