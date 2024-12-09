import React from 'react';
import JoinInput from './joinInputBox';
import { useConfig } from '../../Context/configContext.jsx';
import { useUserContext } from '../../Context/userContext.jsx';

const JoinBox = (props) => {
    const {toggleLoginModal, goToTopSlide} = props;
    const { serverUrl } = useConfig();
    const { userInfo } = useUserContext();
    

    const clickJoin = () => {
        fetch(`${serverUrl}/customer/join`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(userInfo)
        }).then((response) => {
            alert("회원가입이 완료되었습니다!!!");
            window.location.reload(true);
        });
    }

    return(
        <div className='joinBox'>
            <img onClick={goToTopSlide} className='LoginLogo' src="/Image/CommonImage/LogoWhite.png"/>
            <JoinInput/>
            <button onClick={clickJoin} className='joinButton'>회원가입</button>
            <div className='textLoginBox'><span>이미 회원이신가요?</span><span className='goToLoginText' onClick={toggleLoginModal}>로그인</span></div>
        </div>
    )
}

export default JoinBox;