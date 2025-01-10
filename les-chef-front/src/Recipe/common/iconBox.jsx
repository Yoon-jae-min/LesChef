//기타
import React from "react";
import { Link, useNavigate } from "react-router-dom";

//CSS
import styles from "../../CSS/recipe/common/icon.module.css"

//컨텍스트
import { useConfig } from "../../Context/configContext";
import { useAuthContext } from "../../Context/authContext";

const Icon = (props) => {
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
        return window.confirm(message);
    };

    const clickLogout = () => {
        if(confirmAction("로그아웃 하시겠습니까?")){
            fetch(`${serverUrl}/customer/logout`,{
                credentials: 'include'
            }).then(
                (response) => {
                    if(response){
                        setIsLogin(false);
                        sessionStorage.removeItem('userData');
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
        <div className={styles.body}>
            <img 
                onClick={clickProfile} 
                src={`${serverUrl}/Image/CommonImage/profileIcon.png`} 
                className={styles.icon}/>
            <Link 
                to="/communityMain" 
                onClick={categoryStateReset}>
                    <img 
                        src={`${serverUrl}/Image/CommonImage/communityIcon.png`} 
                        className={`${styles.icon} ${styles.community}`}/></Link>
            <div>
                { !isLogin && 
                    <img 
                        onClick={clickLogin} 
                        className={styles.icon} 
                        src={`${serverUrl}/Image/CommonImage/loginIcon.png`}/>}
                { isLogin && 
                    <img 
                        onClick={clickLogout} 
                        className={styles.icon} 
                        src={`${serverUrl}/Image/CommonImage/logoutIcon.png`}/>}
            </div>
        </div>
    )
}

export default Icon;