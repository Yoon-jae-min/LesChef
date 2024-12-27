//기타
import React from 'react';

//컨텍스트
import { useConfig } from '../../Context/configContext.jsx';
import { useUserContext } from '../../Context/userContext.jsx';

//컴포넌트
import JoinInput from './joinInputBox';


const JoinBox = (props) => {
    const { toggleLoginModal, 
            goToTopSlide, 
            checkPwd, 
            setCheckPwd, 
            diffCheck, 
            setDiffCheck, 
            dupliCheck, 
            setDupliCheck} = props;
    const { serverUrl } = useConfig();
    const { userInfo } = useUserContext();

    const clickJoin = () => {
        if(userInfo.id === ""){
            alert("아이디를 입력해주세요");
        }else if(userInfo.name === ""){
            alert("이름을 입력해주세요");
        }else if(userInfo.nickName === ""){
            alert("닉네임을 입력해주세요");
        }else if(userInfo.tel.length < 10 && userInfo.tel.length > 0){
            alert("전화번호를 제대로 입력해주세요");
        }else if(userInfo.pwd === ""){
            alert("비밀번호를 입력해주세요");
        }else if(userInfo.pwd !== checkPwd){
            alert("비밀번호를 확인해주세요");
        }else if(!dupliCheck){
            alert("아이디 중복 확인해주세요");
        }else{
            fetch(`${serverUrl}/customer/join`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(userInfo)
            }).then((response) => {
                alert("회원가입이 완료되었습니다!!!");
                window.location.reload(true);
            });
        }
    }

    return(
        <div className='joinBox'>
            <img 
                onClick={goToTopSlide} 
                className='LoginLogo' 
                src={`${serverUrl}/Image/CommonImage/LogoWhite.png`}/>
            <JoinInput 
                setCheckPwd={setCheckPwd} 
                checkPwd={checkPwd} 
                diffCheck={diffCheck} 
                setDiffCheck={setDiffCheck}
                dupliCheck={dupliCheck}
                setDupliCheck={setDupliCheck}/>
            <button onClick={clickJoin} className='joinButton'>회원가입</button>
            <div className='textLoginBox'>
                <span>이미 회원이신가요?</span>
                <span className='goToLoginText' onClick={toggleLoginModal}>로그인</span>
            </div>
        </div>
    )
}

export default JoinBox;