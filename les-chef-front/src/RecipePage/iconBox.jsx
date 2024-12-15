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
        <div className="recipeIconBox">
            <img onClick={clickProfile} src="/Image/CommonImage/profileIcon.png" className="goToCustomerIcon recipeLeftIcon"/>
            <Link to="/communityMain"><img src="/Image/CommonImage/communityIcon.png" className="goToCommunityIcon recipeLeftIcon"/></Link>
        </div>
    )
}

export default IconBox;