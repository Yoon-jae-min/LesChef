import React, { useState } from "react";
import "./customerPage.css";
import CustomerShowBox from "./ShowComponent/container";
import CustomerMenuBox from "./MenuComponent/box";
import IconBox from "./iconBox";

const CustomerPage = () => {
    const [category, setCategory] = useState('My Info');

    return (
        <div className="customerPgBox">
            <img className="customerBgImg" src="/Image/CustomerImage/Background/CustomerBackground.jpg"/>
            <IconBox/>
            <CustomerShowBox category={category}/>
            <CustomerMenuBox setCategory={setCategory}/>
        </div>
    )
}

export default CustomerPage;