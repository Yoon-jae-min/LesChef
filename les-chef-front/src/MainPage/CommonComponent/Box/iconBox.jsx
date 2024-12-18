import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../Context/authContext';
import { useConfig } from '../../../Context/configContext';

const MainIcon = (props) => {
    const navigate = useNavigate();
    const {toggleLoginModal, toggleMenuModal, menuModal} = props
    const { isLogin, setUser, setIsLogin } = useAuthContext();
    const { serverUrl } = useConfig();

    const confirmAction = (message) => {
        return window.confirm(message); // window.confirm을 사용
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
                        setUser(null);
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
                navigate('/customerMain');
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
                <hr></hr>
                <hr></hr>
                <hr></hr>
            </div>
            <div>
                { !isLogin && <img onClick={handlerLoginModal} className='mainLoginButton' src="/Image/MainImage/loginWhite.png"/>}
                { isLogin && <img onClick={clickLogout} className='mainLogoutButton' src="/Image/MainImage/logoutWhite.png"/>}
            </div>
            <div className='profileButtonBox'>
                <img onClick={clickProfile} className='mainProfileButton' src="/Image/CommonImage/profileIcon.png"/>
            </div>
            
        </div>
    )
}

export default MainIcon;