//기타
import React from "react";

//CSS
import styles from "../../../../CSS/customer/show/reicpe/common/recipe.module.css";

//컴포넌트
import ListBox from "../list/box";
import InfoBox from "../info/box";
import WriteBox from "../write/box";


const RecipeBody = (props) => {
    const { listPage, 
            setListPage, 
            infoPage, 
            setInfoPage, 
            writePage,
            isEdit } = props;

    return(
        <div className={styles.body}>
            { listPage && 
                <ListBox setInfoPage={setInfoPage} setListPage={setListPage}/>}
            { infoPage && 
                <InfoBox/>}
            { writePage && 
                <WriteBox isEdit={isEdit}/>}
        </div>
    )
}

export default RecipeBody;