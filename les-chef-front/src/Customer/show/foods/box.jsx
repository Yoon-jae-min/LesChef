//기타
import React from "react";

//CSS
import styles from "../../../CSS/customer/show/foods/foods.module.css";

//컴포넌트
import Head from "./head";
import Body from "./body";

const CustomerFoodsBox = () => {
    return(
        <div className={styles.box}>
            <Head/>
            <Body/>
        </div>
    )
}

export default CustomerFoodsBox;