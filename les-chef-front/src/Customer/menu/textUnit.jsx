//기타
import React from "react";
import { useNavigate } from "react-router-dom";

//컨텍스트
import { useUserContext } from "../../Context/user";

//CSS
import styles from "../../CSS/customer/menu/menu.module.css";

const MenuTxtUnit = (props) => {
    const { koreanTxt, 
            englishTxt, 
            setCategory } = props;
    const {authCheck} = useUserContext();
    const navigate = useNavigate();

    const HandlerClick = async() => {
        if(await authCheck()){
            setCategory(englishTxt);
        }else{
            alert("다시 로그인 해주세요!!!");
            navigate("/");
        }
    }

    return(
        <div className={styles.textUnit}>
            <span className={styles.korean} onClick={HandlerClick}>{koreanTxt}</span>
            <span className={styles.english}>{englishTxt}</span>
        </div>
    )
}

export default MenuTxtUnit;