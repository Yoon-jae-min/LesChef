import React from "react";
import { Link } from "react-router-dom";
import MainMenuText from "./text";

const CustomerMenuBox = (props) => {
    const {setCategory, checkUser} = props;

    return(
        <div className="customerMenuBox">
            <Link to="/"><img className="menuLogo" src="/Image/CommonImage/LogoWhite.png"/></Link>
            <MainMenuText setCategory={setCategory} checkUser={checkUser}/>
        </div>
    )
}

export default CustomerMenuBox;