//기타
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

//CSS
import styles from "../../../CSS/main/modal/menu.module.css";

const CategoryText = (props) => {
    const {menuModal} = props;
    const textBoxRef = useRef(null);

    useEffect(() => {
        const textPs = textBoxRef.current.querySelectorAll('.text');

        if(!menuModal){
            textPs.forEach((textP) => {
                textP.classList.add(`${styles.noneShow}`);
            })
        }else{
            textPs.forEach((textP) => {
                textP.classList.remove(`${styles.noneShow}`);
            })
        }
    }, [menuModal]);

    const handleCategoryClick = (category) => {
        localStorage.setItem("selectedCategory", category);
    };

    return(
        <div ref={textBoxRef} className={styles.textBox}>
            <Link 
                to="/recipeMain" 
                state={{category: "korean"}} 
                onClick={() => handleCategoryClick("korean")} 
                className={styles.link}>
                    <div className={styles.textUnit}>
                        <p className={`${styles.text} text`}>Korean</p>
                    </div></Link>
            <Link 
                to="/recipeMain" 
                state={{category: "western"}} 
                onClick={() => handleCategoryClick("western")} 
                className={styles.link}>
                    <div className={styles.textUnit}>
                        <p className={`${styles.text} text`}>Western</p>
                    </div></Link>
            <Link 
                to="/recipeMain" 
                state={{category: "japanese"}} 
                onClick={() => handleCategoryClick("japanese")} 
                className={styles.link}>
                    <div className={styles.textUnit}>
                        <p className={`${styles.text} text`}>Japanese</p>
                    </div></Link>
            <Link 
                to="/recipeMain" 
                state={{category: "chinese"}} 
                onClick={() => handleCategoryClick("chinese")} 
                className={styles.link}>
                    <div className={styles.textUnit}>
                        <p className={`${styles.text} text`}>Chinese</p>
                    </div></Link>
            <Link 
                to="/recipeMain" 
                state={{category: "share"}} 
                onClick={() => handleCategoryClick("share")} 
                className={styles.link}>
                    <div className={styles.textUnit}>
                        <p className={`${styles.text} text`}>Share Recipe</p>
                    </div></Link>
            <Link 
                to="/communityMain" 
                className={styles.link}>
                    <div className={styles.textUnit}>
                        <p className={`${styles.text} text`}>Community</p>
                    </div></Link>
        </div>
    )
}

export default CategoryText;