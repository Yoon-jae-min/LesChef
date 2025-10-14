//기타
import React from "react";

//CSS
import styles from "../../CSS/recipe/menu/menu.module.css"

//컴포넌트
import TextUnit from "./textUnit";

const Text = (props) => {
    const {setCategory, setInfoGoto} = props;

    return(
        <div className={styles.textBox}>
            <TextUnit 
                koreanTxt="한식레시피" 
                englishTxt="korean" 
                setCategory={setCategory} 
                setInfoGoto={setInfoGoto}/>
            <TextUnit 
                koreanTxt="일식레시피" 
                englishTxt="japanese" 
                setCategory={setCategory} 
                setInfoGoto={setInfoGoto}/>
            <TextUnit 
                koreanTxt="중식레시피" 
                englishTxt="chinese" 
                setCategory={setCategory} 
                setInfoGoto={setInfoGoto}/>
            <TextUnit 
                koreanTxt="양식레시피" 
                englishTxt="western" 
                setCategory={setCategory} 
                setInfoGoto={setInfoGoto}/>
            <TextUnit
                koreanTxt="기타레시피"
                englishTxt="other"
                setCategory={setCategory} 
                setInfoGoto={setInfoGoto}/>
            <TextUnit 
                koreanTxt="공유레시피" 
                englishTxt="share" 
                setCategory={setCategory} 
                setInfoGoto={setInfoGoto}/>
            
        </div>
    )
}

export default Text;