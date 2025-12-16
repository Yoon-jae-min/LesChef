//기타
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//CSS
import styles from "../../../CSS/main/common/left.module.css";

//컨텍스트
import { useConfig } from '../../../Context/config';
import { useUserContext } from '../../../Context/user';

const MainIcon = (props) => {
    const navigate = useNavigate();
    const { toggleLoginModal, 
            toggleMenuModal, 
            menuModal} = props
    const { serverUrl } = useConfig();
    const { isLogin, setIsLogin, authCheck } = useUserContext();

    const confirmAction = (message) => {
        return window.confirm(message);
    };

    const handlerMenuModal = () => {
        toggleMenuModal();
    };

    const handlerLoginModal = () => {
        toggleLoginModal();
    }

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
                            navigate('/');
                        }
                    }
                ).catch((err) => {
                    console.log(err);
                });
            }
        }
    }

    const clickProfile = async() => {
        if(await authCheck()){
            navigate('/customerMain');
        }else{
            alert("로그인이 필요합니다!!!");
        }
    }

    useEffect(() => {
        const loginButton = isLogin ? '.logoutBtn' : '.loginBtn';

        if(menuModal){
            document.querySelector(loginButton).classList.add(`${styles.hidden}`);
            document.querySelector('.profileBtn').classList.add(`${styles.hidden}`);
        }
        else{
            document.querySelector(loginButton).classList.remove(`${styles.hidden}`);
            document.querySelector('.profileBtn').classList.remove(`${styles.hidden}`);
        }

    }, [menuModal]);
    
    return (
        <div className={styles.iconBox}>
            <img onClick={handlerMenuModal} className={styles.menuBtn} src={`${serverUrl}/Image/CommonImage/menuIcon.png`}/>
            { !isLogin && 
                <img 
                    onClick={handlerLoginModal} 
                    className={`${styles.loginBtn} loginBtn`} 
                    src={`${serverUrl}/Image/CommonImage/loginIcon.png`}/>}
            { isLogin && 
                <img 
                    onClick={clickLogout} 
                    className={`${styles.logoutBtn} logoutBtn`} 
                    src={`${serverUrl}/Image/CommonImage/logoutIcon.png`}/>}
            <img 
                onClick={clickProfile} 
                className={`${styles.profileBtn} profileBtn`} 
                src={`${serverUrl}/Image/CommonImage/profileIcon.png`}/>
        </div>
    )
}

export default MainIcon;