//기타
import React from "react";

//CSS
import styles from "../../../CSS/customer/show/common/show.module.css";

//컴포넌트
import ShowHead from "./header";
import CustomerShowBody from "./body";

const CustomerShowBox = (props) => {
    const {category} = props;

    return(
        <div className={styles.box}>
            <ShowHead 
                category={category}/>
            <CustomerShowBody 
                category={category}/>
        </div>
    )
}

export default CustomerShowBox;