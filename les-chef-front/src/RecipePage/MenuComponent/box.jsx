import React from "react";
import RecipeMenuText from "./text";
import { Link } from "react-router-dom";
import { useConfig } from "../../Context/configContext";

const RecipeMenuBox = (props) => {
    const {setCategory, setInfoGoto} = props;
    const { serverUrl } = useConfig();

    const categoryStateReset = () => {
        localStorage.setItem("selectedCategory", "");
    }
    
    return(
        <div className="recipeMenuBox">
            <RecipeMenuText setCategory={setCategory} setInfoGoto={setInfoGoto}/>
            <Link to="/" onClick={categoryStateReset}><img className="recipeLogo" src={`${serverUrl}/Image/CommonImage/LogoWhite.png`}/></Link>
        </div>
    )
}

export default RecipeMenuBox