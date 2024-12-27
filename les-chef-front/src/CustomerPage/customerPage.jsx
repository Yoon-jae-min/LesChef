//기타
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//CSS
import "../CSS/customerPage.css";

//컨텍스트
import { useConfig } from "../Context/configContext";

//컴포넌트
import CustomerShowBox from "./ShowComponent/container";
import CustomerMenuBox from "./MenuComponent/box";
import IconBox from "./iconBox";


const CustomerPage = () => {
    const [category, setCategory] = useState('My Info');
    const { serverUrl } = useConfig();
    const navigate = useNavigate();

    const checkUser = () => {
        fetch(`${serverUrl}/customer/auth`,{
            credentials: 'include'
        }).then((response) => response.json()).then((data) => {
            if(!data.loggedIn){
                alert("다시 로그인 해주세요!!!");
                navigate("/");
            }
        }).catch((err) => console.log(err));
    }

    return (
        <div className="customerPgBox">
            <img className="customerBgImg" src={`${serverUrl}/Image/CustomerImage/Background/CustomerBackground.jpg`}/>
            <IconBox/>
            <CustomerShowBox 
                category={category} 
                checkUser={checkUser}/>
            <CustomerMenuBox 
                setCategory={setCategory} 
                checkUser={checkUser}/>
        </div>
    )
}

export default CustomerPage;