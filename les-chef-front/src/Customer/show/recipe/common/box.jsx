//기타
import React, { useState } from "react";

//CSS
import styles from "../../../../CSS/customer/show/reicpe/common/recipe.module.css";

//컴포넌트
import RecipeHead from "./head";
import RecipeBody from "./body";

const CustomerRecipeBox = () => {
    const [listPage, setListPage] = useState(true);
    const [writePage, setWritePage] = useState(false);
    const [infoPage, setInfoPage] = useState(false);

    return(
        <div className={styles.box}>
            <RecipeHead 
                listPage={listPage} 
                setListPage={setListPage} 
                writePage={writePage} 
                setWritePage={setWritePage} 
                infoPage={infoPage} 
                setInfoPage={setInfoPage}/>
            <RecipeBody 
                listPage={listPage} 
                setListPage={setListPage} 
                writePage={writePage} 
                setWritePage={setWritePage} 
                infoPage={infoPage} 
                setInfoPage={setInfoPage}/>
        </div>
    )
}

export default CustomerRecipeBox;