import React from "react";

const CustomerInfoBox = () => {
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
                    {/* <div className="passwordCheckBox">
                        <p className="passwordCheckLabel">비밀번호</p>
                        <input type="text" className="passwordCheckInput"/>
                        <button type="button" className="passwordCheckBtn">확인</button>
                    </div> */}
                    <div className="passwordUpdateBox">
                        <div className="passwordNewBox passwordUpdateInner">
                            <p></p>
                            <input/>
                        </div>
                        <div className="passwordNewCheckBox passwordUpdateInner">
                            <p></p>
                            <input/>
                            <button></button>
                        </div>
                    </div>
                </div>

            </div>
            <div className="customerInfoBtnBox">

            </div>
        </div>
    )
}

export default CustomerInfoBox;