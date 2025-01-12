//기타
import React from "react";
import { Link, useNavigate } from "react-router-dom";

//CSS
import styles from "../../CSS/community/common/icon.module.css";

//컨텍스트
import { useConfig } from "../../Context/config";
import { useUserContext } from "../../Context/user";

const IconBox = (props) => {
    const { toggleLoginModal } = props;
    const navigate = useNavigate();
    const { serverUrl } = useConfig();
    const { isLogin, setIsLogin, authCheck } = useUserContext();

    const clickProfile = async() => {
        if(await authCheck()){
            navigate('/customerMain');
        }else{
            alert("로그인이 필요합니다!!!");
        }
    }

    const clickLogin = () => {
        toggleLoginModal();
    }


    const confirmAction = (message) => {
        return window.confirm(message);
    };

    const clickLogout = async() => {
        if(await authCheck()){
            if(confirmAction("로그아웃 하시겠습니까?")){
                fetch(`${serverUrl}/customer/logout`,{
                    credentials: 'include'
                }).then(
                    (response) => {
                        if(response){
                            setIsLogin(false);
                            sessionStorage.removeItem('userData');
                            alert("로그아웃 되셨습니다.");
                            window.history.go(0);
                        }
                    }
                ).catch((err) => {
                    console.log(err);
                });
            }
        }
    }

    return(
        <div className={styles.box}>
            <Link to="/">
                <img className={`commuToHomeIcon ${styles.icon}`} src={`${serverUrl}/Image/CommonImage/homeIcon.png`}/></Link>
            <img onClick={clickProfile} className={`commuToCustomerIcon ${styles.icon}`} src={`${serverUrl}/Image/CommonImage/profileIcon.png`}/>
            <Link to="/recipeMain" state={{category: "korean"}}>
                <img className={`commuToRecipeIcon ${styles.icon}`} src={`${serverUrl}/Image/CommonImage/recipeIcon.png`}/></Link>
            <div className={styles.loginBtn}>
                { !isLogin && 
                    <img onClick={clickLogin} className={`${styles.icon}`} src={`${serverUrl}/Image/CommonImage/loginIcon.png`}/>}
                { isLogin && 
                    <img onClick={clickLogout} className={`${styles.icon}`} src={`${serverUrl}/Image/CommonImage/logoutIcon.png`}/>}
            </div>
        </div>
    )
}

export default IconBox;