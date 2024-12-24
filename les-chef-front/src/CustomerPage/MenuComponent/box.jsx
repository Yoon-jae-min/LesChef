import React from "react";
import { Link } from "react-router-dom";
import MainMenuText from "./text";
import { useConfig } from "../../Context/configContext";

const CustomerMenuBox = (props) => {
    const {setCategory, checkUser} = props;
    const {serverUrl} = useConfig();

    return(
        <div className="customerMenuBox">
            <Link to="/"><img className="menuLogo" src={`${serverUrl}/Image/CommonImage/LogoWhite.png`}/></Link>
            <MainMenuText setCategory={setCategory} checkUser={checkUser}/>
        </div>
    )
}

export default CustomerMenuBox;