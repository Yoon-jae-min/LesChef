import React from 'react';
import LoginLogo from "../../Image/MainImage/LogoWhite.png"
import LoginInput from './loginInputBox';

const JoinBox = () => {
    return(
        <div className='joinBox'>
            <img className='LoginLogo' src={LoginLogo}/>
            <LoginInput/>
        </div>
    )
}

export default JoinBox;