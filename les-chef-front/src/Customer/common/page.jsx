//기타
import React, { useEffect, useState } from "react";

//CSS
import styles from "../../CSS/customer/common/page.module.css";

//컨텍스트
import { useConfig } from "../../Context/config";

//컴포넌트
import CustomerShowBox from "../show/common/box";
import CustomerMenuBox from "../menu/box";
import IconBox from "./iconBox";


const CustomerPage = () => {
    const [category, setCategory] = useState('My Info');
    const { serverUrl } = useConfig();

    return (
        <div className={styles.body}>
            <img className={styles.bgImg} src={`${serverUrl}/Image/CustomerImage/Background/CustomerBackground.jpg`}/>
            <IconBox/>
            <CustomerShowBox 
                category={category}/>
            <CustomerMenuBox 
                setCategory={setCategory}/>
        </div>
    )
}

export default CustomerPage;