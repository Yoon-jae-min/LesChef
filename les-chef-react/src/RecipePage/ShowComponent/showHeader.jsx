import React, { useEffect, useState } from "react";
import KoreanHeadImg from "../../Image/RecipeImage/Background/listHeaderKorean.png";
import JapaneseHeadImg from "../../Image/RecipeImage/Background/listHeaderJapanese.png";
import ChineseHeadImg from "../../Image/RecipeImage/Background/listHeaderChinese.png";
import WesternHeadImg from "../../Image/RecipeImage/Background/listHeaderWestern.png";
import ShareHeadImg from "../../Image/RecipeImage/Background/listHeaderShare.png";


const RecipeShowHead = (props) => {
    const {category} = props;
    const [headImgUrl, setHeadImgUrl] = useState(KoreanHeadImg);
    const [headText, setHeadText] = useState("Korean");

    useEffect(() => {
        if(category === "korean"){
            setHeadImgUrl(KoreanHeadImg);
            setHeadText("Korean");
        }else if(category === "japanese"){
            setHeadImgUrl(JapaneseHeadImg);
            setHeadText("Japanese");
        }else if(category === "chinese"){
            setHeadImgUrl(ChineseHeadImg);
            setHeadText("Chinese");
        }else if(category === "western"){
            setHeadImgUrl(WesternHeadImg);
            setHeadText("Western");
        }else if(category === "share"){
            setHeadImgUrl(ShareHeadImg);
            setHeadText("Share");
        }
    }, [category]);

    return(
        <div className="recipeShowHead">
            <img src={headImgUrl} className="recipeHeadImg"/>
            <p className="recipeHeadText">{headText}</p>
        </div>
    )
}

export default RecipeShowHead;