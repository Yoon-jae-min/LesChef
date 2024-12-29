//기타
import React, { useEffect, useState } from "react";

const ShowGpBoxLeft = (props) => {
    const {category, infoGoto} = props;
    const [firstText, setFirstText] = useState("국, 찌개");
    const [secondText, setSecondText] = useState("밥, 면");
    const [thirdText, setThirdText] = useState("반찬");
    const [activeIndex, setActiveIndex] = useState(0);

    const clickGroup = (index) => {
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

        setActiveIndex(0);
    }, [category]);

    return(
        <div className="showGpBoxLeft">
            {infoGoto && <div className="recipeInfoName">참치김치찌개</div>}
            {(!infoGoto && category != 'share') && 
                <React.Fragment>
                    <span 
                        onClick={() => clickGroup(0)} 
                        className={activeIndex === 0 ? "active" : ""}>전체</span>
                    <span 
                        onClick={() => clickGroup(1)} 
                        className={activeIndex === 1 ? "active" : ""}>{firstText}</span>
                    <span 
                        onClick={() => clickGroup(2)} 
                        className={activeIndex === 2 ? "active" : ""}>{secondText}</span>
                    <span 
                        onClick={() => clickGroup(3)} 
                        className={activeIndex === 3 ? "active" : ""}>{thirdText}</span>
                    <span 
                        onClick={() => clickGroup(4)} 
                        className={activeIndex === 4 ? "active" : ""}>기타</span></React.Fragment>
            }
        </div>
    )
}

export default ShowGpBoxLeft;