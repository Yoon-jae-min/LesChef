//기타
import React, { useEffect } from "react";

//CSS
import styles from "../../../CSS/customer/show/foods/foods.module.css";

//컨텍스트
import { useConfig } from "../../../Context/config";
import { useFoods } from "../../../Context/foods";

//컴포넌트
import Head from "./head";
import Body from "./body";

const CustomerFoodsBox = () => {
    const {serverUrl} = useConfig();
    const {setSectionList} = useFoods();

    useEffect(() => {
        fetch(`${serverUrl}/foods/place`,{
            method: "GET",
            credentials: "include"
        }).then(resonse => resonse.json()).then(data => {
            setSectionList(data.sectionList);
        }).catch(err => console.log(err));
    }, [])

    return(
        <div className={styles.box}>
            <Head/>
            <Body/>
        </div>
    )
}

export default CustomerFoodsBox;