//기타
import React from "react";

//컨텍스트
import { useUserContext } from "../../Context/userContext";

//컴포넌트
import LabelInput from "./labelInput";


const JoinInput = (props) => {
    const { setCheckPwd, 
            checkPwd, 
            diffCheck, 
            setDiffCheck, 
            dupliCheck, 
            setDupliCheck } = props;
    const { userInfo } = useUserContext();

    return(
        <div className="JoinInput">
            <LabelInput 
                boxType = "join" 
                labelText = "이메일(아이디)" 
                basicValue={userInfo.id}
                dupliCheck={dupliCheck}
                setDupliCheck={setDupliCheck}/>
            <LabelInput 
                boxType = "join" 
                labelText = "이름" 
                basicValue={userInfo.name}/>
            <LabelInput 
                boxType = "join" 
                labelText = "닉네임" 
                basicValue={userInfo.nickName}/>
            <LabelInput 
                boxType = "join" 
                labelText = "전화번호" basicValue={userInfo.tel}/>
            <LabelInput 
                boxType = "join" 
                labelText = "비밀번호" 
                basicValue={userInfo.pwd}/>
            <LabelInput 
                boxType = "join" 
                labelText = "비밀번호 확인" 
                basicValue={checkPwd} 
                setCheckPwd={setCheckPwd} 
                diffCheck={diffCheck} 
                setDiffCheck={setDiffCheck}/>
        </div>
    )
}

export default JoinInput;