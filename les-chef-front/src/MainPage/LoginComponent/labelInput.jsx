import React, { useState, useEffect } from "react";
import { useUserContext } from "../../Context/userContext";

const LabelInput = (props) => {
    const { labelText, boxType, inputValue, basicValue } = props;
    const { setUserInfo } = useUserContext();

    const changeValue = (value) => {
        if(boxType === "join"){
            const fieldMapping = {
                "이메일(아이디)": "id",
                "비밀번호": "pwd",
                "이름": "name",
                "닉네임": "nickName",
                "전화번호": "tel",
            };
        
            const field = fieldMapping[labelText];
            if (field) {
                setUserInfo((prevInfo) => ({ ...prevInfo, [field]: value }));
            }
        }else if(boxType === "login"){
            inputValue(value);
        }
        
    };

    return(
        <div>
            <label className="eachLabel">{labelText}</label>
            <input value={basicValue} onChange={(e) => {changeValue(e.target.value)}} className="eachInput"></input>
        </div>
    )
}

export default LabelInput;