//기타
import React, { useEffect, useState } from "react";

//CSS
import styles from "../../../CSS/recipe/show/show.module.css"

//컨텍스트
import { useConfig } from "../../../Context/config";
import { useUserContext } from "../../../Context/user";

const Head = (props) => {
    const {category, setInfoGoto} = props;
    const { serverUrl } = useConfig();
    const {authCheck} = useUserContext();
    const [headImgUrl, setHeadImgUrl] = useState(`${serverUrl}/Image/RecipeImage/Background/listHeaderKorean.png`);
    const [headText, setHeadText] = useState("Korean");

    useEffect(() => {
        if(category === "korean"){
            setHeadImgUrl(`${serverUrl}/Image/RecipeImage/Background/listHeaderKorean.png`);
            setHeadText("Korean");
        }else if(category === "japanese"){
            setHeadImgUrl(`${serverUrl}/Image/RecipeImage/Background/listHeaderJapanese.png`);
            setHeadText("Japanese");
        }else if(category === "chinese"){
            setHeadImgUrl(`${serverUrl}/Image/RecipeImage/Background/listHeaderChinese.png`);
            setHeadText("Chinese");
        }else if(category === "western"){
            setHeadImgUrl(`${serverUrl}/Image/RecipeImage/Background/listHeaderWestern.png`);
            setHeadText("Western");
        }else if(category === "other"){
            setHeadImgUrl(`${serverUrl}/Image/RecipeImage/Background/listHeaderOther.png`);
            setHeadText("Other");
        }else if(category === "share"){
            setHeadImgUrl(`${serverUrl}/Image/RecipeImage/Background/listHeaderShare.png`);
            setHeadText("Share");
        }
    }, [category]);

    const clickText = async() => {
        setInfoGoto(false);
        await authCheck();
    }

    return(
        <div className={styles.head}>
            <img src={headImgUrl} className={styles.headImg}/>
            <p onClick={clickText} className={styles.headText}>{headText}</p>
        </div>
    )
}

export default Head;