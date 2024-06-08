import React from 'react';
import LoginLogo from "../../Image/MainImage/LogoWhite.png"
import JoinInput from './joinInputBox';

const JoinBox = (props) => {
    const {toggleLoginModal} = props;

    return(
        <div className='joinBox'>
            <img className='LoginLogo' src={LoginLogo}/>
            <JoinInput/>
            <button className='joinButton'>회원가입</button>
            <div className='textLoginBox'><span>이미 회원이신가요?</span><span className='goToLoginText' onClick={toggleLoginModal}>로그인</span></div>
        </div>
    )
}

export default JoinBox;