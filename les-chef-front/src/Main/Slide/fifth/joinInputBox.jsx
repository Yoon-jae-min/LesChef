//기타
import React from "react";

//CSS
import styles from "../../../CSS/main/section/join.module.css";

//컴포넌트
import LabelInput from "../../common/labelInput";


const JoinInput = (props) => {
    const { setCheckPwd, 
            checkPwd, 
            diffCheck, 
            setDiffCheck, 
            dupliCheck, 
            setDupliCheck,
            saveInfo,
            setSaveInfo } = props;

    return(
        <div className={styles.input}>
            <LabelInput 
                boxType = "join" 
                labelText = "이메일(아이디)" 
                basicValue={saveInfo.id}
                dupliCheck={dupliCheck}
                setDupliCheck={setDupliCheck}
                saveInfo={saveInfo}
                setSaveInfo={setSaveInfo}/>
            <LabelInput 
                boxType = "join" 
                labelText = "이름" 
                basicValue={saveInfo.name}
                saveInfo={saveInfo}
                setSaveInfo={setSaveInfo}/>
            <LabelInput 
                boxType = "join" 
                labelText = "닉네임" 
                basicValue={saveInfo.nickName}
                saveInfo={saveInfo}
                setSaveInfo={setSaveInfo}/>
            <LabelInput 
                boxType = "join" 
                labelText = "전화번호" basicValue={saveInfo.tel}
                saveInfo={saveInfo}
                setSaveInfo={setSaveInfo}/>
            <LabelInput 
                boxType = "join" 
                labelText = "비밀번호" 
                basicValue={saveInfo.pwd}
                saveInfo={saveInfo}
                setSaveInfo={setSaveInfo}/>
            <LabelInput 
                boxType = "join" 
                labelText = "비밀번호 확인" 
                basicValue={checkPwd} 
                setCheckPwd={setCheckPwd} 
                diffCheck={diffCheck} 
                setDiffCheck={setDiffCheck}
                saveInfo={saveInfo}
                setSaveInfo={setSaveInfo}/>
        </div>
    )
}

export default JoinInput;