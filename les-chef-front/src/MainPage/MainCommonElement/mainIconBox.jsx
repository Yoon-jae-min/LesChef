import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const MainIcon = (props) => {
    const {toggleLoginModal, toggleMenuModal, menuModal} = props

    const handlerMenuModal = () => {
        toggleMenuModal();
    };

    const handlerLoginModal = () => {
        toggleLoginModal();
    }

    useEffect(() => {
        if(menuModal){
            document.querySelector('.mainLoginButton').classList.add('hidden');
            document.querySelector('.mainProfileButton').classList.add('hidden');
        }
        else{
            document.querySelector('.mainLoginButton').classList.remove('hidden');
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
            <div onClick={handlerLoginModal}><img className='mainLoginButton' src="/Image/MainImage/loginWhite.png"/></div>
            <Link to='/customerMain'><img className='mainProfileButton' src="/Image/CommonImage/profileIcon.png"/></Link>
        </div>
    )
}

export default MainIcon;