import React, { useState } from "react";

const CustomerInfoBox = () => {
    const [ changeInfo, setChangeInfo ] = useState(false);
    const [ pwdChange, setPwdChange] = useState(false);
    const [ checkedPwd, setCheckPwd ] = useState(false);
    const [ checkInputText, setCheckInputText ] = useState("");

    const changeInfoClick = () => {
        setChangeInfo(true);
        setPwdChange(false);
    }

    const changeInfoCancel = () => {
        setChangeInfo(false);
    }

    const changePwdClick = () => {
        setPwdChange(true);
        setChangeInfo(false);
    }

    const changePwdCancel = () => {
        setPwdChange(false);
        setCheckPwd(false);
    }

    const checkBtnClick = () => {
        if(checkInputText === "1234"){
            setCheckPwd(true);
            setPwdChange(false);
        }else{

        }

        setCheckInputText("");
    }

    const checkInputUpdate = (e) => {
        setCheckInputText(e.target.value);
    }
    

    return(
        <div className="customerInfoBox">
            <div className="customerInfoBoxInner">
                <div className="infoBoxInnerMain">
                    <img className="profileImg" src="/Image/CustomerImage/profileImg.jpg"/>
                    <div className="customerInfoUnits">
                        <div className="userIdBox customerInfoUnit">
                            <p className="infoUnitLabel">아이디</p>
                            <p className="infoUnitText">woasl0708</p>
                        </div>
                        <div className="infoNickNameBox customerInfoUnit">
                            <p className="infoUnitLabel">닉네임</p>
                            <p className="infoUnitText">잼인</p>
                        </div>
                        <div className="emailBox customerInfoUnit">
                            <p className="infoUnitLabel">이메일</p>
                            <p className="infoUnitText">jmyoon1994@naver.com</p>
                        </div>
                        <div className="telNumBox customerInfoUnit">
                            <p className="infoUnitLabel">전화번호</p>
                            <p className="infoUnitText">010-1111-1111</p>
                        </div>
                    </div>
                </div>
                <div className="passwordChangeBox">
                    { pwdChange && <div className="passwordCheckBox">
                        <p className="passwordCheckLabel">비밀번호</p>
                        <input type="text" className="passwordCheckInput" value={checkInputText} onChange={checkInputUpdate}/>
                        <button onClick={checkBtnClick} type="button" className="passwordCheckBtn">확인</button>
                    </div> }
                    { checkedPwd && <div className="passwordUpdateBox">
                        <div className="passwordNewBox passwordUpdateInner">
                            <p className="passwordNewLabel passwordUpdateLabel">새 비밀번호</p>
                            <input className="passwordNewInput passwordUpdateInput"/>
                        </div>
                        <div className="passwordNewCheckBox passwordUpdateInner">
                            <p className="passwordNewCheckLabel passwordUpdateLabel">새 비밀번호 확인</p>
                            <input className="passwordNewCheckInput passwordUpdateInput"/>
                        </div>
                        <button className="passwordUpdateBtn">변경</button>
                    </div> }
                </div>

            </div>
            <div className="customerInfoBtnBox">
                { (!changeInfo && !pwdChange && !checkedPwd) && <button onClick={changeInfoClick} type="button" className="customerInfoChangeBtn">회원정보 변경</button>}
                { changeInfo && <button onClick={changeInfoCancel} type="button" className="customerInfoCgBtnCancel">회원정보 변경 취소</button>}
                { (!changeInfo && !pwdChange && !checkedPwd) && <button onClick={changePwdClick} type="button" className="customerpwdChangeBtn">비밀번호 변경</button>}
                { (pwdChange || checkedPwd) && <button onClick={changePwdCancel} type="button" className="customerpwdCgBtnCancel">비밀번호 변경 취소</button> }
            </div>
        </div>
    )
}

export default CustomerInfoBox;