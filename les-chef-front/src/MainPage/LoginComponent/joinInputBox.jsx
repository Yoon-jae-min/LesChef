import React from "react";
import LabelInput from "./labelInput";
import { useUserContext } from "../../Context/userContext";

const JoinInput = (props) => {
    const { setCheckPwd, checkPwd, diffCheck, setDiffCheck } = props;
    const { userInfo } = useUserContext();

    return(
        <div className="JoinInput">
            <LabelInput boxType = "join" labelText = "이메일(아이디)" basicValue={userInfo.id}/>
            <LabelInput boxType = "join" labelText = "이름" basicValue={userInfo.name}/>
            <LabelInput boxType = "join" labelText = "닉네임" basicValue={userInfo.nickName}/>
            <LabelInput boxType = "join" labelText = "전화번호" basicValue={userInfo.tel}/>
            <LabelInput boxType = "join" labelText = "비밀번호" basicValue={userInfo.pwd}/>
            <LabelInput boxType = "join" labelText = "비밀번호 확인" basicValue={checkPwd} setCheckPwd={setCheckPwd} diffCheck={diffCheck} setDiffCheck={setDiffCheck}/>
        </div>
    )
}

export default JoinInput;