//기타
import React, { useEffect } from "react";

//CSS
import styles from "../../../CSS/community/show/write/write.module.css";

//컨텍스트
import { useConfig } from "../../../Context/configContext";
import { useBoardContext } from "../../../Context/board";
import { useUserContext } from "../../../Context/userContext";

const WriteBox = (props) => {
    const { goToList } = props;
    const {serverUrl} = useConfig();
    const {userData, setUserData} = useUserContext();
    const {writeContent, setWriteContent} = useBoardContext();

    useEffect(() => {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        setWriteContent((prev) => ({...prev, id: userData.id, nickName: userData.nickName}));
        setUserData(userData);
    }, [])

    const enrollWrite = () => {
        if(writeContent.title === ""){
            alert("제목을 입력해주세요");
        }else{
            fetch(`${serverUrl}/board/write`,{
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    title: writeContent.title,
                    id: userData.id,
                    nickName: userData.nickName,
                    content: writeContent.content
                }),
                credentials: "include"
            }).then(response => window.history.go(0)).catch(err => console.log(err));
        }
    }

    const titleInput = (title) => {
        setWriteContent((prev) => ({...prev, title: title}));
    }

    const contentInput = (content) => {
        setWriteContent((prev) => ({...prev, content: content}));
    }

    return(
        <React.Fragment>
            <div className={styles.box}>
                <div className={styles.title}>
                    <p className={`${styles.label} titleText`}>제목</p>
                    <input type="text" className={styles.titleUnit} onChange={(e) => titleInput(e.target.value)}></input>
                </div>
                <div className={styles.nickName}>
                    <p className={`${styles.label} nickNameText`}>작성자</p>
                    <p className={styles.nickNameUnit}>{userData.nickName}</p>
                </div>
                <div className={styles.content}>
                    <textarea className={styles.textArea} onChange={(e) => contentInput(e.target.value)}></textarea>
                </div>
            </div>
            <div className={styles.btnBox}>
                <button onClick={enrollWrite} className={styles.submitBtn} type="button">등록</button>
                <button onClick={goToList} className={styles.commonBtn} type="button">취소</button>
            </div>
        </React.Fragment>
    )
}

export default WriteBox;