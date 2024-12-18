import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useConfig } from "../Context/configContext";

const IconBox = (props) => {
    const { toggleLoginModal } = props;
    const navigate = useNavigate();
    const { serverUrl } = useConfig();

    const clickProfile = () => {
        fetch(`${serverUrl}/customer/auth`, {
            credentials: "include"
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if(data.loggedIn){
                navigate('/customerMain');
            }else{
                alert("로그인을 해주세요");
                toggleLoginModal();
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    return(
        <div className="communityIconBox">
            <Link to="/"><img className="goToHomeIcon communityLeftIcon" src="/Image/CommonImage/homeIcon.png"/></Link>
            <img onClick={clickProfile} className="goToCustomerIcon communityLeftIcon" src="/Image/CommonImage/profileIcon.png"/>
            <Link to="/recipeMain" state={{category: "korean"}}><img className="goToRecipeIcon communityLeftIcon" src="/Image/CommonImage/recipeIcon.png"/></Link>
        </div>
    )
}

export default IconBox;