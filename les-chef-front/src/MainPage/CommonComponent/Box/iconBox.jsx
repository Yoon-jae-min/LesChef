//기타
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//컨텍스트
import { useAuthContext } from '../../../Context/authContext';
import { useConfig } from '../../../Context/configContext';
import { useUserContext } from '../../../Context/userContext';

const MainIcon = (props) => {
    const navigate = useNavigate();
    const { toggleLoginModal, 
            toggleMenuModal, 
            menuModal} = props
    const { isLogin, setIsLogin } = useAuthContext();
    const { serverUrl } = useConfig();
    const { setUserData } = useUserContext();

    const confirmAction = (message) => {
        return window.confirm(message);
    };

    const handlerMenuModal = () => {
        toggleMenuModal();
    };

    const handlerLoginModal = () => {
        toggleLoginModal();
    }

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

    const clickProfile = () => {
        fetch(`${serverUrl}/customer/auth`,{
            credentials: "include"
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if(data.loggedIn){
                fetch(`${serverUrl}/customer/info`,{
                    credentials: "include"
                }).then(response => response.json()).then((data) => {
                    setUserData({
                        id: data.id,
                        nickName: data.nickName,
                        name: data.name,
                        tel: data.tel
                    });
                    navigate('/customerMain');
                }).catch(err => console.log(err));
            }else{
                alert("로그인을 해주세요");
                toggleLoginModal();
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    useEffect(() => {
        const loginButton = isLogin ? '.mainLogoutButton' : '.mainLoginButton';

        if(menuModal){
            document.querySelector(loginButton).classList.add('hidden');
            document.querySelector('.mainProfileButton').classList.add('hidden');
        }
        else{
            document.querySelector(loginButton).classList.remove('hidden');
            document.querySelector('.mainProfileButton').classList.remove('hidden');
        }

    }, [menuModal]);

    return (
        <div className='mainIconBox'>
            <div onClick={handlerMenuModal} className='mainMenuButton'>
                <hr/><hr/><hr/>
            </div>
            <div>
                { !isLogin && 
                    <img 
                        onClick={handlerLoginModal} 
                        className='mainLoginButton' 
                        src={`${serverUrl}/Image/CommonImage/loginWhite.png`}/>}
                { isLogin && 
                    <img 
                        onClick={clickLogout} 
                        className='mainLogoutButton' 
                        src={`${serverUrl}/Image/CommonImage/logoutWhite.png`}/>}
            </div>
            <div className='profileButtonBox'>
                <img 
                    onClick={clickProfile} 
                    className='mainProfileButton' 
                    src={`${serverUrl}/Image/CommonImage/profileIcon.png`}/>
            </div>
            
        </div>
    )
}

export default MainIcon;