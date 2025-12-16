//기타
import React from "react";
import { useNavigate } from "react-router-dom";

//CSS
import styles from "../../../../CSS/customer/show/info/contentBox/content.module.css";

//컨텍스트
import { useConfig } from "../../../../Context/config";
import { useUserContext } from "../../../../Context/user";

const WithDraw = (props) => {
    const {setWdBox, setNotice} = props;
    const {serverUrl} = useConfig();
    const {authCheck} = useUserContext();
    const navigate = useNavigate();

    const confirmWd = () => {
        return window.confirm("정말 탈퇴하시겠습니까?");
    }

    const clickWd = async() => {
        if(!confirmWd()){
            setWdBox((prev) => (!prev));
            setNotice((prev) => (!prev));
            return;
        }

        if(await authCheck()){
            fetch(`${serverUrl}/customer/delete`, {
                method: "DELETE",
                credentials: "include"
            }).then(response => {
                if(!response.ok){
                    throw new Error("error");
                }
                return response.json();
            }).then(data => {
                if(data.result){
                    alert("탈퇴처리가 완료되었습니다");
                    window.localStorage.removeItem("userData");
                    navigate('/');
                }
            }).catch(err => {
                console.log(err);
                alert('잠시후 다시 시도해주세요');
                window.location.reload();
            })
        }else{
            alert("다시 로그인해 주세요");
            navigate("/");
        }
    }

    const clickWdCancel = async() => {
        if(await authCheck()){
            setWdBox((prev) => (!prev));
            setNotice((prev) => (!prev));
        }else{
            alert("다시 로그인해 주세요");
            navigate("/");
        }
    }

    return(
        <div className={styles.body}>
            <div className={styles.wdContent}>
                정말로 회원 탈퇴를 하시겠습니까?<br/>
                회원 탈퇴 후에는 아래와 같은 사항이 발생합니다:<br/><br/>

                <ul>
                    <li>탈퇴 후에는 [LesChef]의 일부 서비스를 더 이상 이용하실 수수 없습니다.</li>
                    <li>만약 유료 서비스가 남아있다면, 관련 결제나 잔여금액은 환불되지 않거나 서비스 약관에 따라 처리될 수 있습니다.</li>
                </ul><br/>

                회원 탈퇴가 완료되면 다시 복구할 수 없으니 신중하게 결정해 주세요.
            </div>
            <div className={styles.wdBtnBox}>
                <button onClick={clickWd} type="button" className={styles.wdOk}>회원탈퇴</button>
                <button onClick={clickWdCancel} type="button" className={styles.wdCancel}>탈퇴취소</button>
            </div>
        </div>
    )
};

export default WithDraw