//기타
import React from "react";

//컨텍스트
import { useConfig } from "../../../../Context/configContext";

//컴포넌트
import RecipeHeadSolt from "./headSolt";

const RecipeHead = (props) => {
    const { 
            listPage, 
            setListPage, 
            writePage, 
            setWritePage, 
            infoPage, 
            setInfoPage } = props;
    const {serverUrl} = useConfig();
    

    const clickGoList = () => {
        setListPage(true);
        setWritePage(false);
        setInfoPage(false);
    }

    const AddRecipe = () => {
        setWritePage(true);
        setListPage(false);
    }

    return(
        <div className="customerRecipeHead">
            <RecipeHeadSolt 
                listPage={listPage} 
                infoPage={infoPage} 
                writePage={writePage}/>
            { listPage && 
                <img onClick={AddRecipe} className="addRecipeBtn" src={`${serverUrl}/Image/CommonImage/add.png`}/>}
            { (!listPage && (writePage || infoPage)) && 
                <img onClick={clickGoList} className="goToRecipeList" src={`${serverUrl}/Image/CommonImage/goToBack.png`}/> }
        </div>
    )
}

export default RecipeHead;