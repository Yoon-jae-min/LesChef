//기타
import React from "react";
import { Link, useNavigate } from "react-router-dom";

//CSS
import styles from "../../CSS/customer/common/icon.module.css";

//컨텍스트
import { useConfig } from "../../Context/configContext";
import { useAuthContext } from "../../Context/authContext"; 

const IconBox = () => {
    const {serverUrl} = useConfig();
    const navigate = useNavigate();
    const { setIsLogin } = useAuthContext();

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
                        alert("로그아웃 되셨습니다.");
                        navigate('/');
                    }
                }
            ).catch((err) => {
                console.log(err);
            });
        }
    }

    return(
        <div className={styles.body}>
            <Link to="/communityMain">
                <img className={styles.unit} src={`${serverUrl}/Image/CommonImage/communityIcon.png`}/></Link>
            <Link to="/recipeMain" state={{ category: "korean" }}>
                <img className={styles.unit} src={`${serverUrl}/Image/CommonImage/recipeIcon.png`}/></Link>
            <img 
                onClick={clickLogout} 
                className={styles.unit} 
                src={`${serverUrl}/Image/CommonImage/logoutIcon.png`}/>
        </div>
    )  
}

export default IconBox;