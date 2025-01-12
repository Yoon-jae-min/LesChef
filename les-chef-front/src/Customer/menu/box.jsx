//기타
import React from "react";
import { Link } from "react-router-dom";

//CSS
import styles from "../../CSS/customer/menu/menu.module.css";

//컨텍스트
import { useConfig } from "../../Context/config";

//컴포넌트
import MainMenuText from "./text";

const CustomerMenuBox = (props) => {
    const {setCategory, checkUser} = props;
    const {serverUrl} = useConfig();

    return(
        <div className={styles.body}>
            <Link to="/">
                <img className={styles.logo} src={`${serverUrl}/Image/CommonImage/LogoWhite.png`}/></Link>
            <MainMenuText 
                setCategory={setCategory} 
                checkUser={checkUser}/>
        </div>
    )
}

export default CustomerMenuBox;