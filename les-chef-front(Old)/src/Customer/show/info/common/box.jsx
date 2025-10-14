//기타
import React, { useEffect, useState } from "react";

//CSS
import styles from "../../../../CSS/customer/show/info/common/info.module.css";

//컨텍스트
import { useConfig } from "../../../../Context/config";

//컴포넌트
import WithDraw from "../contentBox/withDraw";
import CheckBox from "../contentBox/checkBox";
import ChgPwd from "../contentBox/chgPwd";
import ChgInform from "../contentBox/chgInform";
import Notice from "../contentBox/notice";

const CustomerInfoBox = () => {
    const { serverUrl } = useConfig();
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const [wdBox, setWdBox] = useState(false);
    const [checkPwd, setCheckPwd] = useState(false);
    const [menuBox, setMenuBox] = useState(false);
    const [chgPwdBox, setChgPwdBox] = useState(false);
    const [chgInfoBox, setChgInfoBox] = useState(false);
    const [notice, setNotice] = useState(true);
    const [checkContent, setCheckContent] = useState("");

    const clickWd = () => {
        if(notice && !checkPwd){
            setCheckPwd((prev) => (!prev));
            setCheckContent("withDraw");
            setNotice((prev) => (!prev));
        }
    }

    const clickChgMenu = () => {
        if(notice){
            setMenuBox((prev) => (!prev));
        }
    }

    const clickChgInfo = () => {
        if(!checkPwd){
            setCheckPwd((prev) => (!prev));
        }
        if(notice){
            setNotice((prev) => (!prev));
        }
        setMenuBox((prev) => (!prev));
        setCheckContent("inform");
    }

    const clickChgPwd = () => {
        if(!checkPwd){
            setCheckPwd((prev) => (!prev));
        }
        if(notice){
            setNotice((prev) => (!prev));
        }
        setMenuBox((prev) => (!prev));
        setCheckContent("password");
    }

    return(
        <div className={styles.box}>
            <div className={styles.left}>
                <img className={styles.profileImg} src={`${serverUrl}/Image/CommonImage/faceGray.png`}/>
                <div className={styles.iconBox}>
                    <div className={styles.icon}>
                        <img className={styles.iconImg} src={`${serverUrl}/Image/CommonImage/recipeGray.png`}/>
                        <p className={styles.iconText}>0</p>
                    </div>
                    <div className={styles.icon}>
                        <img className={styles.iconImg} src={`${serverUrl}/Image/CommonImage/foods.png`}/>
                        <p className={styles.iconText}>0</p>
                    </div>
                    <div className={styles.icon}>
                        <img className={styles.iconImg} src={`${serverUrl}/Image/CommonImage/likeGray.png`}/>
                        <p className={styles.iconText}>0</p>
                    </div>
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.head}>
                    <p className={styles.nickName}>{userData.nickName}</p>
                    <div className={styles.btnBox}>
                        <img onClick={clickChgMenu} className={styles.chgBtn} src={`${serverUrl}/Image/CustomerImage/customerChg.png`}/>
                        <img onClick={clickWd} className={styles.wdBtn} src={`${serverUrl}/Image/CustomerImage/customerExit.png`}/>
                    </div>
                </div>
                {menuBox && 
                    <div className={styles.menuBox}>
                        <div onClick={clickChgInfo} className={styles.chgInfo}>개인정보</div>
                        <div onClick={clickChgPwd} className={styles.chgPwd}>패스워드</div>
                    </div>}
                {notice && <Notice/>}
                {wdBox && <WithDraw setWdBox={setWdBox} setNotice={setNotice}/>}
                {checkPwd && <CheckBox setCheckPwd={setCheckPwd} setWdBox={setWdBox} setChgPwdBox={setChgPwdBox} setChgInfoBox={setChgInfoBox} setNotice={setNotice} checkContent={checkContent}/>}
                {chgPwdBox && <ChgPwd setChgPwdBox={setChgPwdBox} setNotice={setNotice}/>}
                {chgInfoBox && <ChgInform setChgInfoBox={setChgInfoBox} setNotice={setNotice} userData={userData}/>}
            </div>
        </div>
    )
}

export default CustomerInfoBox;