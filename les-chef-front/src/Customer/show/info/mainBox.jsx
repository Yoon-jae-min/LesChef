//기타
import React from "react";

//CSS
import styles from "../../../CSS/customer/show/info/main.module.css";

//컨텍스트
import { useUserContext } from "../../../Context/user";
import { useConfig } from "../../../Context/config";

const Main = () => {
    const { serverUrl } = useConfig();
    const { userData } = useUserContext();

    return(
        <div className={styles.mainBox}>
            <img className={styles.profileImg} src={`${serverUrl}/Image/CustomerImage/profileImg.jpg`}/>
            <div className={styles.infoBox}>
                <div className={`userIdBox ${styles.infoUnit}`}>
                    <p className={styles.unitLabel}>아이디</p>
                    <p className={styles.unitText}>{userData.id}</p>
                </div>
                <div className={`nameBox ${styles.infoUnit}`}>
                    <p className={styles.unitLabel}>이름</p>
                    <p className={styles.unitText}>{userData.name}</p>
                </div>
                <div className={`infoNickNameBox ${styles.infoUnit}`}>
                    <p className={styles.unitLabel}>닉네임</p>
                    <p className={styles.unitText}>{userData.nickName}</p>
                </div>
                <div className={`telNumBox ${styles.infoUnit}`}>
                    <p className={styles.unitLabel}>전화번호</p>
                    <p className={styles.unitText}>{userData.tel}</p>
                </div>
            </div>
        </div>
    )
}

export default Main;