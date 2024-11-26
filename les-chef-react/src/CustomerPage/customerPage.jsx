import React, { useState } from "react";
import CustomerBgImg from "../Image/CustomerImage/Background/CustomerBackground.jpg"
import "./customerPage.css";
import CustomerShowBox from "./ShowComponent/showBox";
import CustomerMenuBox from "./MenuComponent/menuBox";
import IconBox from "./iconBox";

const CustomerPage = () => {
    const [category, setCategory] = useState('My Info');

    return (
        <div className="customerPgBox">
            <img className="customerBgImg" src={CustomerBgImg}/>
            <IconBox/>
            <CustomerShowBox category={category}/>
            <CustomerMenuBox setCategory={setCategory}/>
        </div>
    )
}

export default CustomerPage;