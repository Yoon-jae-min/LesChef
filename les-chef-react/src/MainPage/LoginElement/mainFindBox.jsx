import React, { useEffect } from "react";
import FindId from "./mainFindId";
import FindPw from "./mainFindPw";

const FindBox = (props) => {
    const {loginToFind, toggleFindIdPw, idPwBox} = props;

    useEffect(() => {
        const idButton = document.querySelector('.idButton');
        const pwButton = document.querySelector('.pwButton');

        idButton.classList.add('click');
        pwButton.classList.remove('click');
    }, [])

    const HandlerSwitch = () => {
        const idButton = document.querySelector('.idButton');
        const pwButton = document.querySelector('.pwButton');

        if(idButton.classList.contains('click')){
            idButton.classList.remove('click');
            pwButton.classList.add('click');
        }else{
            idButton.classList.add('click');
            pwButton.classList.remove('click');
        }

        toggleFindIdPw();
    }

    return(
        <div className="loginBox" style={{opacity: loginToFind ? '1' : '0'}}>
            <img className='LoginLogo' src="/Image/CommonImage/LogoWhite.png"/>
            <div className="idPwButton">
                <div className="idButton click" onClick={HandlerSwitch}>로그인</div>
                <div className="pwButton" onClick={HandlerSwitch}>비밀번호</div>
            </div>
            {!idPwBox && <FindId idPwBox={idPwBox}/>}
            {idPwBox && <FindPw idPwBox={idPwBox}/>}
        </div>
    )
}

export default FindBox;