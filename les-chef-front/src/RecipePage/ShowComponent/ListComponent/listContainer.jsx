//기타
import React, { useEffect } from "react";

//컨텍스트
import { useRecipeContext } from "../../../Context/recipeContext";

//컴포넌트
import ListElement from "./listInner";

const ElementContainer = (props) => {
    const {setInfoGoto} = props;
    const {recipeList} = useRecipeContext();

    return(
        <div className="elementContainer">
            {recipeList.map((recipe, index) => {
                return (<ListElement 
                    key={index} 
                    setInfoGoto={setInfoGoto} 
                    recipeImg={recipe.recipeImg}
                    recipeName={recipe.recipeName}
                    recipeNickName={recipe.userNickName}
                    recipeWatch={recipe.viewCount}
                    isShare={recipe.isShare}/>
                );
            })}
        </div>
    )
}

export default ElementContainer;