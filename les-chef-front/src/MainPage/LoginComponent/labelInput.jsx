import React, { useState } from "react";
import { useUserContext } from "../../Context/userContext";

const LabelInput = (props) => {
    const { labelText, boxType, inputValue, basicValue, setCheckPwd, diffCheck, setDiffCheck } = props;
    const { userInfo, setUserInfo } = useUserContext();

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
                let formattedValue = value;
    
                if (labelText === "전화번호") {
                    let numericValue = value.replace(/[^0-9]/g, "");

                    if (numericValue.length > 11) {
                        numericValue = numericValue.slice(0, 11);
                    }

                    formattedValue = numericValue.replace((numericValue.length <= 10) ? 
                        /(\d{3})(\d{0,3})(\d{0,4})/ : /(\d{3})(\d{0,4})(\d{0,4})/,
                        (match, p1, p2, p3) => { 
                            if (numericValue.length <= 10) {
                                p2 = p2.slice(0, 3);
                                p3 = p3.slice(0, 4);
                            }else{
                                p2 = p2.slice(0, 4);
                                p3 = p3.slice(0, 4);
                            }
                            return [p1, p2, p3].filter(Boolean).join("-");
                        }
                    );
                }
    
                setUserInfo((prevInfo) => ({ ...prevInfo, [field]: formattedValue }));
            }
        }else if(boxType === "login"){
            inputValue(value);
        }
        
        if(labelText === "비밀번호 확인"){
            setCheckPwd(value);
            setDiffCheck(userInfo.pwd !== value);
        }
    };

    return(
        <div>
            <label className="eachLabel">{labelText}{ ( diffCheck && (labelText === "비밀번호 확인")) && <p className="diffCheck"> ※ 비밀번호가 다릅니다</p>}</label>
            <input type={labelText.includes("비밀번호") ? "password" : "text"} value={basicValue} onChange={(e) => {changeValue(e.target.value)}} className="eachInput"></input>
        </div>
    )
}

export default LabelInput;