import React from "react";
import MenuLogo from "../../Image/CommonImage/LogoWhite.png"
import { Link } from "react-router-dom";
import MainMenuText from "./menuText";

const CustomerMenuBox = () => {
    return(
        <div className="customerMenuBox">
            <Link to="/"><img className="menuLogo" src={MenuLogo}/></Link>
            <MainMenuText/>
        </div>
    )
}

export default CustomerMenuBox;