import React, { useState } from "react";
import RecipeHead from "./Head/head";
import RecipeBody from "./Body/body";

const CustomerRecipeBox = () => {
    const [listPage, setListPage] = useState(true);
    const [writePage, setWritePage] = useState(false);
    const [infoPage, setInfoPage] = useState(false);

    return(
        <div className="customerRecipeBox">
            <RecipeHead listPage={listPage} setListPage={setListPage} writePage={writePage} setWritePage={setWritePage} infoPage={infoPage} setInfoPage={setInfoPage}/>
            <RecipeBody listPage={listPage} setListPage={setListPage} writePage={writePage} setWritePage={setWritePage} infoPage={infoPage} setInfoPage={setInfoPage}/>
        </div>
    )
}

export default CustomerRecipeBox;