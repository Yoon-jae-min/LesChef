import React from "react";
import RecipeLogo from "../../Image/RecipeImage/LogoWhite.png"
import RecipeMenuText from "./recipeMenuText";
import { Link } from "react-router-dom";

const RecipeMenuBox = (props) => {
    const {setCategory, setInfoGoto} = props;
    
    return(
        <div className="recipeMenuBox">
            <RecipeMenuText setCategory={setCategory} setInfoGoto={setInfoGoto}/>
            <Link to="/"><img className="recipeLogo" src={RecipeLogo}/></Link>
        </div>
    )
}

export default RecipeMenuBox