import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useConfig } from "../Context/configContext";
import { useAuthContext } from "../Context/authContext";

const IconBox = (props) => {
    const { toggleLoginModal } = props;
    const navigate = useNavigate();
    const { serverUrl } = useConfig();
    const { isLogin, setIsLogin } = useAuthContext();

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

    const clickLogin = () => {
        toggleLoginModal();
    }

    const confirmAction = (message) => {
        return window.confirm(message); // window.confirm을 사용
    };

    const clickLogout = () => {
        if(confirmAction("로그아웃 하시겠습니까?")){
            fetch(`${serverUrl}/customer/logout`,{
                credentials: 'include'
            }).then(
                (response) => {
                    if(response){
                        // setUser(null);
                        setIsLogin(false);
                        alert("로그아웃 되셨습니다.");
                    }
                }
            ).catch((err) => {
                console.log(err);
            });
        }
    }

    return(
        <div className="recipeIconBox">
            <img onClick={clickProfile} src={`${serverUrl}/Image/CommonImage/profileIcon.png`} className="goToCustomerIcon recipeLeftIcon"/>
            <Link to="/communityMain"><img src={`${serverUrl}/Image/CommonImage/communityIcon.png`} className="goToCommunityIcon recipeLeftIcon"/></Link>
            <div>
                { !isLogin && <img onClick={clickLogin} className='recipeLeftIcon' src={`${serverUrl}/Image/MainImage/loginWhite.png`}/>}
                { isLogin && <img onClick={clickLogout} className='recipeLeftIcon' src={`${serverUrl}/Image/MainImage/logoutWhite.png`}/>}
            </div>
        </div>
    )
}

export default IconBox;