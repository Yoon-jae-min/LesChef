//기타
import React from "react";

//CSS
import show from "../../../CSS/recipe/show/show.module.css";

//컴포넌트
import Head from "./header";
import SubHead from "../subHead/box";
import List from "../list/box";
import Info from "../info/common/box";

const Show = (props) => {
    const { category, 
            infoGoto, 
            setInfoGoto } = props;

    return(
        <div className={show.container}>
            <Head 
                category={category} setInfoGoto={setInfoGoto}/>
            <SubHead 
                category={category} 
                infoGoto={infoGoto}/>
            <hr/>
            { !infoGoto && 
                <List
                    setInfoGoto={setInfoGoto}/> }
            { infoGoto && 
                <Info/> }
            <hr/>
        </div>
    )
}

export default Show;