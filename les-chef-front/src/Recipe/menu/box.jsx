//기타
import React from "react";
import { Link } from "react-router-dom";

//CSS
import styles from "../../CSS/recipe/menu/menu.module.css"

//컨텍스트
import { useConfig } from "../../Context/configContext";

//컴포넌트
import Text from "./text";


const Menu = (props) => {
    const {setCategory, setInfoGoto} = props;
    const { serverUrl } = useConfig();

    const categoryStateReset = () => {
        localStorage.setItem("selectedCategory", "");
    }
    
    return(
        <div className={styles.body}>
            <Text 
                setCategory={setCategory} 
                setInfoGoto={setInfoGoto}/>
            <Link 
                to="/" 
                onClick={categoryStateReset}>
                    <img 
                        className={styles.logo} 
                        src={`${serverUrl}/Image/CommonImage/LogoWhite.png`}/></Link>
        </div>
    )
}

export default Menu