import React, { useEffect } from 'react';
import LoginImage from '../../Image/MainImage/loginWhite.png'
import ProfileImage from '../../Image/MainImage/profileWhite.png'

const MainIcon = (props) => {
    const {toggleMenuModal, menuModal} = props

    const handlerModal = () => {
        toggleMenuModal();
    };

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
            <div onClick={handlerModal} className='mainMenuButton'>
                <hr></hr>
                <hr></hr>
                <hr></hr>
            </div>
            <a href='#'><img className='mainLoginButton' src={LoginImage}/></a>
            <a href='#'><img className='mainProfileButton' src={ProfileImage}/></a>
        </div>
    )
}

export default MainIcon;