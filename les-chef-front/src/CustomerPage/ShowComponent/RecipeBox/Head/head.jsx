import React from "react";
import RecipeHeadSolt from "./headSolt";

const RecipeHead = (props) => {
    const { listPage, setListPage, writePage, setWritePage, infoPage, setInfoPage } = props;
    

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
            <RecipeHeadSolt listPage={listPage} infoPage={infoPage}/>
            { listPage && <img onClick={AddRecipe} className="addRecipeBtn" src="/Image/CommonImage/add.png"/>}
            { (!listPage && (writePage || infoPage)) && <img onClick={clickGoList} className="goToRecipeList" src="/Image/CommonImage/goToBack.png"/> }
        </div>
    )
}

export default RecipeHead;