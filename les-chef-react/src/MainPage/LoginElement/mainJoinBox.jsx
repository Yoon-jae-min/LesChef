import React from 'react';
import LoginLogo from "../../Image/MainImage/LogoWhite.png"
import LoginInput from './loginInputBox';

const JoinBox = () => {
    return(
        <div className='joinBox'>
            <img className='LoginLogo' src={LoginLogo}/>
            <LoginInput/>
            <button className='joinButton'>회원가입</button>
            <div className='textLoginBox'><span>이미 회원이신가요?</span><span className='goToLoginText'>로그인</span></div>
        </div>
    )
}

export default JoinBox;