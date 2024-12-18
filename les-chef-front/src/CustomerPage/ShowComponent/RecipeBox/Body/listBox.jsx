import React, { useState } from "react";
import RecipeListUnit from "./listUnit";

const ListBox = (props) => {
    const { setInfoPage, setListPage } = props;
    const [elementCount, setElementCount] = useState(4);

    return(
        <>
            {Array.from({length: elementCount}).map((_, index) => {
                return <RecipeListUnit key={index} setInfoPage={setInfoPage} setListPage={setListPage}/>
            })}
        </>
    )
}

export default ListBox;