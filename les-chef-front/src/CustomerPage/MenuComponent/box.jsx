//기타
import React from "react";
import { Link } from "react-router-dom";

//컨텍스트
import { useConfig } from "../../Context/configContext";

//컴포넌트
import MainMenuText from "./text";

const CustomerMenuBox = (props) => {
    const {setCategory, checkUser} = props;
    const {serverUrl} = useConfig();

    return(
        <div className="customerMenuBox">
            <Link to="/">
                <img className="menuLogo" src={`${serverUrl}/Image/CommonImage/LogoWhite.png`}/></Link>
            <MainMenuText 
                setCategory={setCategory} 
                checkUser={checkUser}/>
        </div>
    )
}

export default CustomerMenuBox;