//기타
import React from "react";

//컨텍스트
import { useConfig } from "../../../../Context/configContext";
import { useRecipeContext } from "../../../../Context/recipeContext";

//컴포넌트
import RecipeHeadSolt from "./headSolt";

const RecipeHead = (props) => {
    const { listPage, 
            setListPage, 
            writePage, 
            setWritePage, 
            infoPage, 
            setInfoPage } = props;
    const {serverUrl} = useConfig();
    const { wrRecipeInfo, 
            wrRecipeIngres, 
            wrRecipeSteps } = useRecipeContext();
    

    const clickGoList = () => {
        setListPage(true);
        setWritePage(false);
        setInfoPage(false);
    }

    const addRecipe = () => {
        setWritePage(true);
        setListPage(false);
    }

    const enrollRecipe = () => {

    }

    return(
        <div className="customerRecipeHead">
            <RecipeHeadSolt 
                listPage={listPage} 
                infoPage={infoPage} 
                writePage={writePage}/>
            {listPage && 
                <img onClick={addRecipe} className="addRecipeBtn" src={`${serverUrl}/Image/CommonImage/add.png`}/>}
            {(!listPage && (writePage || infoPage)) && 
                <img onClick={clickGoList} className="goToRecipeList" src={`${serverUrl}/Image/CommonImage/goToBack.png`}/> }
            {writePage &&
                <img onClick={enrollRecipe} className="enrollRecipeBtn" src={`${serverUrl}/Image/CommonImage/enroll.png`}/>}
        </div>
    )
}

export default RecipeHead;