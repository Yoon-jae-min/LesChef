//기타
import React from "react";

//CSS
import styles from "../../../../CSS/customer/show/reicpe/common/recipe.module.css";

//컴포넌트
import ListBox from "../list/box";
import InfoBox from "../info/box";

const Body = (props) => {
    const {listPage, setListPage, category} = props;

    return(
        <div className={styles.body}>
            { listPage && 
                <ListBox setListPage={setListPage} category={category}/>}
            { !listPage && 
                <InfoBox/>}
        </div>
    )
}

export default Body;