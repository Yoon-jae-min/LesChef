import React, { useState } from "react";
import ListBox from "./listBox";
import InfoBox from "./infoBox";


const RecipeBody = (props) => {
    const { listPage, setListPage, infoPage, setInfoPage } = props;

    return(
        <div className="customerRecipeBody">
            { listPage && <ListBox setInfoPage={setInfoPage} setListPage={setListPage}/> }
            { infoPage && <InfoBox/> }
        </div>
    )
}

export default RecipeBody;