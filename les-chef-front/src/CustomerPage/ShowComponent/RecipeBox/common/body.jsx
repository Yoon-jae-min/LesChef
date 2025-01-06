//기타
import React from "react";

//컴포넌트
import ListBox from "../list/listBox";
import InfoBox from "../info/infoBox";
import WriteBox from "../write/writeBox";


const RecipeBody = (props) => {
    const { listPage, 
            setListPage, 
            infoPage, 
            setInfoPage, 
            writePage } = props;

    return(
        <div className="customerRecipeBody">
            { listPage && 
                <ListBox setInfoPage={setInfoPage} setListPage={setListPage}/>}
            { infoPage && 
                <InfoBox/>}
            { writePage && 
                <WriteBox/>}
        </div>
    )
}

export default RecipeBody;