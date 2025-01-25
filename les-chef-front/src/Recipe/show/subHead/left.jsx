//기타
import React, { useEffect, useState } from "react";

//CSS
import styles from "../../../CSS/recipe/show/subHead.module.css"

//컨텍스트
import { useRecipeContext } from "../../../Context/recipe";

const Left = (props) => {
    const {category, infoGoto} = props;
    const [firstText, setFirstText] = useState("국, 찌개");
    const [secondText, setSecondText] = useState("밥, 면");
    const [thirdText, setThirdText] = useState("반찬");
    const [activeIndex, setActiveIndex] = useState(0);
    const {setSoltText, selectedRecipe} = useRecipeContext();

    const clickGroup = (text, index) => {
        setSoltText(text);
        setActiveIndex(index);
    }

    useEffect(() => {
        if(category === "korean"){
            setFirstText("국/찌개");
            setSecondText("밥/면");
            setThirdText("반찬");
        }else if(category === "japanese"){
            setFirstText("국/전골");
            setSecondText("밥");
            setThirdText("면");
        }else if(category === "chinese"){
            setFirstText("튀김/찜");
            setSecondText("밥");
            setThirdText("면");
        }else if(category === "western"){
            setFirstText("스프/스튜");
            setSecondText("면");
            setThirdText("빵");
        }else if(category === "other"){
            setFirstText("면");
            setSecondText("밥");
            setThirdText("국");
        }

        setSoltText("전체");
        setActiveIndex(0);
    }, [category]);

    return(
        <div className={styles.left}>
            {infoGoto && <div className={styles.name}>{selectedRecipe.recipeName}</div>}
            {(!infoGoto && category != 'share') && 
                <React.Fragment>
                    <span 
                        onClick={(e) => clickGroup(e.target.innerHTML, 0)} 
                        className={`${styles.sort} ${activeIndex === 0 ? styles.active : ""}`}>전체</span>
                    <span 
                        onClick={(e) => clickGroup(e.target.innerHTML, 1)} 
                        className={`${styles.sort} ${activeIndex === 1 ? styles.active : ""}`}>{firstText}</span>
                    <span 
                        onClick={(e) => clickGroup(e.target.innerHTML, 2)} 
                        className={`${styles.sort} ${activeIndex === 2 ? styles.active : ""}`}>{secondText}</span>
                    <span 
                        onClick={(e) => clickGroup(e.target.innerHTML, 3)} 
                        className={`${styles.sort} ${activeIndex === 3 ? styles.active : ""}`}>{thirdText}</span>
                    <span 
                        onClick={(e) => clickGroup(e.target.innerHTML, 4)} 
                        className={`${styles.sort} ${activeIndex === 4 ? styles.active : ""}`}>기타</span>
                </React.Fragment>
            }
        </div>
    )
}

export default Left;