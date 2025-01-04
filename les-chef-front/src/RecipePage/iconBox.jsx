//기타
import React from "react";
import { Link, useNavigate } from "react-router-dom";

//컨텍스트
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
                categoryStateReset();
                navigate('/customerMain');
            }else{
                alert("로그인이 필요합니다!!!");
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
                        setIsLogin(false);
                        alert("로그아웃 되셨습니다.");
                    }
                }
            ).catch((err) => {
                console.log(err);
            });
        }
    }

    const categoryStateReset = () => {
        localStorage.setItem("selectedCategory", "");
    }

    return(
        <div className="recipeIconBox">
            <img 
                onClick={clickProfile} 
                src={`${serverUrl}/Image/CommonImage/profileIcon.png`} 
                className="reciToCustomerIcon recipeLeftIcon"/>
            <Link 
                to="/communityMain" 
                onClick={categoryStateReset}>
                    <img 
                        src={`${serverUrl}/Image/CommonImage/communityIcon.png`} 
                        className="reciToCommunityIcon recipeLeftIcon"/></Link>
            <div>
                { !isLogin && 
                    <img 
                        onClick={clickLogin} 
                        className='recipeLeftIcon' 
                        src={`${serverUrl}/Image/CommonImage/loginIcon.png`}/>}
                { isLogin && 
                    <img 
                        onClick={clickLogout} 
                        className='recipeLeftIcon' 
                        src={`${serverUrl}/Image/CommonImage/logoutIcon.png`}/>}
            </div>
        </div>
    )
}

export default IconBox;