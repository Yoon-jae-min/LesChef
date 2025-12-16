//기타
import React from "react";

//CSS
import styles from "../../CSS/customer/menu/menu.module.css";

//컴포넌트
import MenuTxtUnit from "./textUnit";

const MainMenuText = (props) => {
    const {setCategory, category} = props;

    return(
        <div className={styles.textBox}>
            <MenuTxtUnit 
                koreanTxt="내 정보" 
                englishTxt="My Info" 
                setCategory={setCategory}
                category={category}/>
            <MenuTxtUnit 
                koreanTxt="나의 레시피" 
                englishTxt="My Recipe" 
                setCategory={setCategory}
                category={category}/>
            <MenuTxtUnit 
                koreanTxt="나의 식재료" 
                englishTxt="My Foods" 
                setCategory={setCategory}
                category={category}/>
            <MenuTxtUnit 
                koreanTxt="찜 목록" 
                englishTxt="Wish List" 
                setCategory={setCategory}
                category={category}/>
        </div>
    )
}

export default MainMenuText;