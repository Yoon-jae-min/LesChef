//기타
import React from "react";

//컴포넌트
import ShowHead from "./header";
import ShowSubHead from "./SubHead/subHead";
import ListContainer from "./ListComponent/listContainer";
import InfoContainer from "./InfoComponent/infoContainer";

const RecipeShowBox = (props) => {
    const { category, 
            infoGoto, 
            setInfoGoto } = props;

    return(
        <div className="recipeShowBox">
            <ShowHead 
                category={category}/>
            <ShowSubHead 
                category={category} 
                infoGoto={infoGoto}/>
            <hr/>
            { !infoGoto && 
                <ListContainer 
                    setInfoGoto={setInfoGoto}/> }
            { infoGoto && 
                <InfoContainer/> }
            <hr/>
        </div>
    )
}

export default RecipeShowBox;