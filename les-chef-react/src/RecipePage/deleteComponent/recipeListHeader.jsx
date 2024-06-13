import React from "react";
import KoreanHeaderImg from "../../Image/RecipeImage/listHeaderKorean.png";
import JapaneseHeaderImg from "../../Image/RecipeImage/listHeaderJapanese.png";
import ChineseHeaderImg from "../../Image/RecipeImage/listHeaderChinese.png";

const ListContainerHeader = (props) => {
    const {listData} = props; 

    return(
        <div className="listContainerHeader">
            {true && <div><img src={KoreanHeaderImg} className="listHeaderImg"/><p className="listHeaderText">Korean Food</p></div>}
            {false && <div><img src={JapaneseHeaderImg} className="listHeaderImg"/><p className="listHeaderText">Japanese Food</p></div>}
            {false && <div><img src={ChineseHeaderImg} className="listHeaderImg"/><p className="listHeaderText">Chinese Food</p></div>}
            
        </div>
    )
}

export default ListContainerHeader;