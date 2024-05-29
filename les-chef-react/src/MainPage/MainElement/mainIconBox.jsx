import React from 'react';
import LoginImage from '../../Image/MainImage/loginWhite.png'
import ProfileImage from '../../Image/MainImage/profileWhite.png'

const MainIcon = () => {
    return (
        <div className='mainIconBox'>
            <a href='#'><div className='mainMenuButton'>
                <hr></hr>
                <hr></hr>
                <hr></hr>
            </div></a>
            <a href='#'><img className='mainLoginButton' src={LoginImage}/></a>
            <a href='#'><img className='mainProfileButton' src={ProfileImage}/></a>
        </div>
    )
}

export default MainIcon;