import React from "react";
import CustomerBgImg from "../Image/CustomerImage/Background/CustomerBackground.jpg"
import "./customerPage.css";
import CustomerShowBox from "./ShowComponent/showBox";
import CustomerMenuBox from "./MenuComponent/menuBox";

const CustomerPage = () => {
    return (
        <div className="customerPgBox">
            <img className="customerBg" src={CustomerBgImg}/>
            <CustomerShowBox/>
            <CustomerMenuBox/>
        </div>
    )
}

export default CustomerPage;