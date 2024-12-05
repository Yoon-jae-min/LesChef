import React, { useEffect, useState } from "react";

const RecipeShowHead = (props) => {
    const {category} = props;
    const [headImgUrl, setHeadImgUrl] = useState("/Image/RecipeImage/Background/listHeaderKorean.png");
    const [headText, setHeadText] = useState("Korean");

    useEffect(() => {
        if(category === "korean"){
            setHeadImgUrl("/Image/RecipeImage/Background/listHeaderKorean.png");
            setHeadText("Korean");
        }else if(category === "japanese"){
            setHeadImgUrl("/Image/RecipeImage/Background/listHeaderJapanese.png");
            setHeadText("Japanese");
        }else if(category === "chinese"){
            setHeadImgUrl("/Image/RecipeImage/Background/listHeaderChinese.png");
            setHeadText("Chinese");
        }else if(category === "western"){
            setHeadImgUrl("/Image/RecipeImage/Background/listHeaderWestern.png");
            setHeadText("Western");
        }else if(category === "share"){
            setHeadImgUrl("/Image/RecipeImage/Background/listHeaderShare.png");
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